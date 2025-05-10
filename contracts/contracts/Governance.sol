// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IEVToken.sol";
import "./interfaces/IUserRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Governance is Ownable {
    IEVToken private evToken;
    IUserRegistry private userRegistry;
    
    // Proposal types
    enum ProposalType {
        FeeChange,
        NetworkExpansion,
        ProtocolUpgrade,
        TokenomicsChange,
        Other
    }
    
    // Proposal state
    enum ProposalState {
        Active,
        Passed,
        Rejected,
        Executed,
        Expired
    }
    
    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        ProposalType proposalType;
        uint256 creationTime;
        uint256 votingEndTime;
        uint256 executionTime;
        ProposalState state;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
        mapping(string => bytes) parameters; // For storing execution parameters
    }
    
    // Vote struct
    struct Vote {
        bool support; // true = yes, false = no
        uint256 votingPower;
    }
    
    // Governance parameters
    uint256 public proposalThreshold = 1000 * 10**18; // Min tokens to create proposal
    uint256 public votingPeriod = 7 days; // Voting period in seconds
    uint256 public executionDelay = 2 days; // Delay between proposal passing and execution
    uint256 public quorum = 10; // Percentage of token supply needed to pass
    
    // Proposal storage
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount = 0;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votingPower);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event GovernanceParameterUpdated(string parameterName, uint256 newValue);
    
    constructor(address _evTokenAddress, address _userRegistryAddress) Ownable(msg.sender) {
        evToken = IEVToken(_evTokenAddress);
        userRegistry = IUserRegistry(_userRegistryAddress);
    }
    
    modifier onlyRegisteredUser() {
        require(userRegistry.isRegistered(msg.sender), "Governance: user not registered");
        _;
    }
    
    // Create a new proposal
    function createProposal(
        string calldata title,
        string calldata description,
        ProposalType proposalType,
        bytes[] calldata paramKeys,
        bytes[] calldata paramValues
    ) external onlyRegisteredUser returns (uint256) {
        // Check if user has enough tokens to create a proposal
        require(evToken.balanceOf(msg.sender) >= proposalThreshold, 
                "Governance: insufficient token balance");
        
        // Ensure parameters match
        require(paramKeys.length == paramValues.length, 
                "Governance: parameter keys and values length mismatch");
        
        // Create new proposal
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.proposalType = proposalType;
        newProposal.creationTime = block.timestamp;
        newProposal.votingEndTime = block.timestamp + votingPeriod;
        newProposal.state = ProposalState.Active;
        
        // Store proposal parameters
        for (uint256 i = 0; i < paramKeys.length; i++) {
            string memory key = abi.decode(paramKeys[i], (string));
            newProposal.parameters[key] = paramValues[i];
        }
        
        emit ProposalCreated(proposalId, msg.sender, title, proposalType);
        
        return proposalId;
    }
    
    // Cast a vote on a proposal
    function castVote(uint256 proposalId, bool support) external onlyRegisteredUser {
        Proposal storage proposal = proposals[proposalId];
        
        // Check if proposal exists and is active
        require(proposal.proposer != address(0), "Governance: proposal doesn't exist");
        require(proposal.state == ProposalState.Active, "Governance: proposal not active");
        require(block.timestamp < proposal.votingEndTime, "Governance: voting period ended");
        require(!proposal.hasVoted[msg.sender], "Governance: already voted");
        
        // Calculate voting power based on user's token balance
        uint256 votingPower = evToken.balanceOf(msg.sender);
        require(votingPower > 0, "Governance: no voting power");
        
        // Record the vote
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.yesVotes += votingPower;
        } else {
            proposal.noVotes += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    // Process a proposal after voting ends
    function processProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        // Check if proposal exists and is active
        require(proposal.proposer != address(0), "Governance: proposal doesn't exist");
        require(proposal.state == ProposalState.Active, "Governance: proposal not active");
        require(block.timestamp > proposal.votingEndTime, "Governance: voting period not ended");
        
        // Calculate total votes and check quorum
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        uint256 totalSupply = evToken.totalSupply();
        
        // Check if quorum is reached
        bool quorumReached = (totalVotes * 100) / totalSupply >= quorum;
        
        if (!quorumReached) {
            proposal.state = ProposalState.Rejected;
            emit ProposalCancelled(proposalId);
            return;
        }
        
        // Check if proposal passed
        if (proposal.yesVotes > proposal.noVotes) {
            proposal.state = ProposalState.Passed;
            proposal.executionTime = block.timestamp + executionDelay;
        } else {
            proposal.state = ProposalState.Rejected;
        }
    }
    
    // Execute a passed proposal
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        // Check if proposal exists and is passed
        require(proposal.proposer != address(0), "Governance: proposal doesn't exist");
        require(proposal.state == ProposalState.Passed, "Governance: proposal not passed");
        require(block.timestamp >= proposal.executionTime, "Governance: execution delay not met");
        
        // Mark as executed
        proposal.state = ProposalState.Executed;
        
        // Execute based on proposal type
        if (proposal.proposalType == ProposalType.FeeChange) {
            _executeFeeChange(proposal);
        } else if (proposal.proposalType == ProposalType.NetworkExpansion) {
            _executeNetworkExpansion(proposal);
        } else if (proposal.proposalType == ProposalType.ProtocolUpgrade) {
            _executeProtocolUpgrade(proposal);
        } else if (proposal.proposalType == ProposalType.TokenomicsChange) {
            _executeTokenomicsChange(proposal);
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    // Cancel a proposal (only by proposer or if conditions no longer valid)
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        // Check if proposal exists and is active
        require(proposal.proposer != address(0), "Governance: proposal doesn't exist");
        require(proposal.state == ProposalState.Active, "Governance: proposal not active");
        
        // Only proposer or if proposer no longer meets threshold can cancel
        require(
            msg.sender == proposal.proposer || 
            evToken.balanceOf(proposal.proposer) < proposalThreshold,
            "Governance: not authorized to cancel"
        );
        
        proposal.state = ProposalState.Rejected;
        emit ProposalCancelled(proposalId);
    }
    
    // Get proposal details (except mappings)
    function getProposalDetails(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        ProposalType proposalType,
        uint256 creationTime,
        uint256 votingEndTime,
        uint256 executionTime,
        ProposalState state,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.proposalType,
            proposal.creationTime,
            proposal.votingEndTime,
            proposal.executionTime,
            proposal.state,
            proposal.yesVotes,
            proposal.noVotes
        );
    }
    
    // Check if an address has voted on a proposal
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    // Get parameter value for a proposal
    function getProposalParameter(uint256 proposalId, string calldata key) external view returns (bytes memory) {
        return proposals[proposalId].parameters[key];
    }
    
    // Update governance parameters (only owner)
    function updateGovernanceParameter(string calldata paramName, uint256 newValue) external onlyOwner {
        if (keccak256(abi.encodePacked(paramName)) == keccak256(abi.encodePacked("proposalThreshold"))) {
            proposalThreshold = newValue;
        } else if (keccak256(abi.encodePacked(paramName)) == keccak256(abi.encodePacked("votingPeriod"))) {
            votingPeriod = newValue;
        } else if (keccak256(abi.encodePacked(paramName)) == keccak256(abi.encodePacked("executionDelay"))) {
            executionDelay = newValue;
        } else if (keccak256(abi.encodePacked(paramName)) == keccak256(abi.encodePacked("quorum"))) {
            require(newValue <= 100, "Governance: quorum cannot exceed 100%");
            quorum = newValue;
        } else {
            revert("Governance: invalid parameter name");
        }
        
        emit GovernanceParameterUpdated(paramName, newValue);
    }
    
    // Execute fee change proposal
    function _executeFeeChange(Proposal storage proposal) private {
        // Implementation depends on your fee structure
        // For example, update transaction fees, charging fees, etc.
        bytes memory feeValue = proposal.parameters["feeValue"];
        bytes memory feeType = proposal.parameters["feeType"];
        
        // Actual implementation would call appropriate contracts
        // Example: if (feeType == "charging") chargingContract.updateFee(abi.decode(feeValue, (uint256)));
    }
    
    // Execute network expansion proposal
    function _executeNetworkExpansion(Proposal storage proposal) private {
        // Implementation for network expansion
        // Could add new regions, approve station operators, etc.
    }
    
    // Execute protocol upgrade proposal
    function _executeProtocolUpgrade(Proposal storage proposal) private {
        // Implementation for protocol upgrades
        // Could change contract implementations, upgrade proxy contracts, etc.
    }
    
    // Execute tokenomics change proposal
    function _executeTokenomicsChange(Proposal storage proposal) private {
        // Implementation for tokenomics changes
        // Could adjust reward rates, token distribution, etc.
    }
    
    // Utility function to check if a proposal exists
    function proposalExists(uint256 proposalId) public view returns (bool) {
        return proposals[proposalId].proposer != address(0);
    }
    
    // Function to get active proposal count
    function getActiveProposalCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            if (proposals[i].state == ProposalState.Active) {
                count++;
            }
        }
        return count;
    }
    
    // Function to check if an address can create a proposal
    function canCreateProposal(address user) external view returns (bool) {
        return userRegistry.isRegistered(user) && evToken.balanceOf(user) >= proposalThreshold;
    }
    
    // Emergency function to handle expired proposals (only owner)
    function handleExpiredProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.proposer != address(0), "Governance: proposal doesn't exist");
        require(proposal.state == ProposalState.Active, "Governance: proposal not active");
        require(block.timestamp > proposal.votingEndTime + 30 days, "Governance: not expired yet");
        
        proposal.state = ProposalState.Expired;
        emit ProposalCancelled(proposalId);
    }
}