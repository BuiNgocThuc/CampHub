// libs/mappers/account.mapper.ts
import { createMapper, createMap } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { Account } from "../types/account.model";
import { AccountResponse } from "../dto/response";
import {
    AccountCreationRequest,
    AccountUpdateRequest,
    AccountPatchRequest,
} from "../dto/request";

export const accountMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<Account>("Account", {
    id: String,
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber: String,
    idNumber: String,
    avatar: String,
    trustScore: Number,
    coinBalance: Number,
    userType: String,
    status: String,
    createdAt: String,
    updatedAt: String,
});

PojosMetadataMap.create<AccountResponse>("AccountResponse", {
    id: String,
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber: String,
    idNumber: String,
    avatar: String,
    trustScore: Number,
    coinBalance: Number,
    userType: String,
    status: String,
    createdAt: String,
    updatedAt: String,
});

PojosMetadataMap.create<AccountCreationRequest>("AccountCreationRequest", {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber: String,
    idNumber: String,
});

PojosMetadataMap.create<AccountUpdateRequest>("AccountUpdateRequest", {
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber: String,
    idNumber: String,
    avatar: String,
    trustScore: Number,
    coinBalance: Number,
    userType: String,
    status: String,
});

PojosMetadataMap.create<AccountPatchRequest>("AccountPatchRequest", {
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    phoneNumber: String,
    idNumber: String,
    avatar: String,
    trustScore: Number,
    coinBalance: Number,
    userType: String,
    status: String,
});

// Mapping
createMap<AccountResponse, Account>(accountMapper, "AccountResponse", "Account");
createMap<Account, AccountCreationRequest>(accountMapper, "Account", "AccountCreationRequest");
createMap<Account, AccountUpdateRequest>(accountMapper, "Account", "AccountUpdateRequest");
createMap<Account, AccountPatchRequest>(accountMapper, "Account", "AccountPatchRequest");

// Export
export const accountMap = {
    fromResponse: (dto: AccountResponse): Account =>
        accountMapper.map<AccountResponse, Account>(dto, "AccountResponse", "Account"),

    toCreationRequest: (model: Account): AccountCreationRequest =>
        accountMapper.map<Account, AccountCreationRequest>(model, "Account", "AccountCreationRequest"),

    toUpdateRequest: (model: Account): AccountUpdateRequest =>
        accountMapper.map<Account, AccountUpdateRequest>(model, "Account", "AccountUpdateRequest"),

    toPatchRequest: (model: Partial<Account>): AccountPatchRequest =>
        accountMapper.map<Partial<Account>, AccountPatchRequest>(model, "Account", "AccountPatchRequest"),
};