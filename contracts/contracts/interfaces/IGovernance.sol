// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IGovernance {
    // Enums
    enum ProposalType {
        FeeChange,
        NetworkExpansion,
        ProtocolUpgrade,
        TokenomicsChange,
        Other
    }
    
    enum ProposalState {
        Active,
        Passed,
        Rejected,
        Executed,
        Expired
    }
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votingPower);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event GovernanceParameterUpdated(string parameterName, uint256 newValue);
    
    // Core functions
    function createProposal(
        string calldata title,
        string calldata description,
        ProposalType proposalType,
        bytes[] calldata paramKeys,
        bytes[] calldata paramValues
    ) external returns (uint256);
    
    function castVote(uint256 proposalId, bool support) external;
    
    function processProposal(uint256 proposalId) external;
    
    function executeProposal(uint256 proposalId) external;
    
    function cancelProposal(uint256 proposalId) external;
    
    // View functions
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
    );
    
    function hasVoted(uint256 proposalId, address voter) external view returns (bool);
    
    function getProposalParameter(uint256 proposalId, string calldata key) external view returns (bytes memory);
    
    function proposalExists(uint256 proposalId) external view returns (bool);
    
    function getActiveProposalCount() external view returns (uint256);
    
    function canCreateProposal(address user) external view returns (bool);
    
    // Governance parameters
    function proposalThreshold() external view returns (uint256);
    
    function votingPeriod() external view returns (uint256);
    
    function executionDelay() external view returns (uint256);
    
    function quorum() external view returns (uint256);
    
    // Admin functions
    function updateGovernanceParameter(string calldata paramName, uint256 newValue) external;
    
    function handleExpiredProposal(uint256 proposalId) external;
}