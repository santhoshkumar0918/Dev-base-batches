/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "BookingManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BookingManager__factory>;
    getContractFactory(
      name: "ChargingStationManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ChargingStationManager__factory>;
    getContractFactory(
      name: "JourneyPlanner",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.JourneyPlanner__factory>;
    getContractFactory(
      name: "VehicleRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VehicleRegistry__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "BookingManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BookingManager>;
    getContractAt(
      name: "ChargingStationManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ChargingStationManager>;
    getContractAt(
      name: "JourneyPlanner",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.JourneyPlanner>;
    getContractAt(
      name: "VehicleRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.VehicleRegistry>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "BookingManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BookingManager>;
    deployContract(
      name: "ChargingStationManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ChargingStationManager>;
    deployContract(
      name: "JourneyPlanner",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.JourneyPlanner>;
    deployContract(
      name: "VehicleRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.VehicleRegistry>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ReentrancyGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "BookingManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BookingManager>;
    deployContract(
      name: "ChargingStationManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ChargingStationManager>;
    deployContract(
      name: "JourneyPlanner",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.JourneyPlanner>;
    deployContract(
      name: "VehicleRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.VehicleRegistry>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
