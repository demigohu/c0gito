/**
 * Contoh GraphQL Hooks untuk Frontend
 * Copy file ini ke src/hooks/ di project Next.js
 */

import { useQuery } from '@tanstack/react-query';
import { GraphQLClient, gql } from 'graphql-request';
import { formatEther } from 'viem';

// Setup GraphQL Client
const PONDER_GRAPHQL_URL = 
  process.env.NEXT_PUBLIC_PONDER_GRAPHQL_URL || 
  'http://localhost:42069/graphql';

const ponderClient = new GraphQLClient(PONDER_GRAPHQL_URL);

// ============================================================================
// GraphQL Queries
// ============================================================================

const GET_USER_DEPOSITS = gql`
  query UserDeposits($user: String!) {
    deposits(
      where: { depositor: $user }
      orderBy: createdAt
      orderDirection: desc
    ) {
      items {
        depositId
        depositor
        token
        initialAmount
        remainingAmount
        isNative
        released
        createdAt
        createdAtBlock
        txHash
        transfers {
          items {
            transferId
            status
            receiver
            amount
            initiatedAt
            completedAt
          }
        }
      }
      totalCount
    }
  }
`;

const GET_USER_SENT_TRANSFERS = gql`
  query UserSentTransfers($user: String!) {
    transfers(
      where: { sender: $user }
      orderBy: initiatedAt
      orderDirection: desc
    ) {
      items {
        transferId
        depositId
        sender
        receiver
        amount
        token
        isNative
        status
        encryptedDataHash
        initiatedAt
        initiatedAtBlock
        initiatedTxHash
        storedAt
        acknowledgedAt
        processedAt
        completedAt
        completedTxHash
        deposit {
          depositId
          initialAmount
          remainingAmount
        }
      }
      totalCount
    }
  }
`;

const GET_USER_RECEIVED_TRANSFERS = gql`
  query UserReceivedTransfers($user: String!) {
    transfers(
      where: { receiver: $user }
      orderBy: processedAt
      orderDirection: desc
    ) {
      items {
        transferId
        sender
        receiver
        amount
        token
        isNative
        status
        processedAt
        processedAtBlock
        completedAt
        completedTxHash
      }
      totalCount
    }
  }
`;

const GET_USER_ACTIVITY = gql`
  query UserActivity($user: String!, $limit: Int) {
    userActivities(
      where: { user: $user }
      orderBy: timestamp
      orderDirection: desc
      limit: $limit
    ) {
      items {
        id
        user
        type
        depositId
        transferId
        amount
        token
        isNative
        timestamp
        blockNumber
        txHash
        receiver
        sender
      }
      totalCount
    }
  }
`;

const GET_TRANSFER_BY_ID = gql`
  query TransferById($transferId: String!) {
    transfer(id: $transferId) {
      transferId
      depositId
      sender
      receiver
      amount
      token
      isNative
      status
      encryptedDataHash
      initiatedAt
      storedAt
      acknowledgedAt
      processedAt
      completedAt
      deposit {
        depositId
        depositor
        initialAmount
        remainingAmount
        isNative
        released
      }
    }
  }
`;

const GET_DEPOSIT_BY_ID = gql`
  query DepositById($depositId: String!) {
    deposit(id: $depositId) {
      depositId
      depositor
      token
      initialAmount
      remainingAmount
      isNative
      released
      createdAt
      lastUsedAt
      transfers {
        transferId
        receiver
        amount
        status
        initiatedAt
        completedAt
      }
    }
  }
`;

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Get all deposits for a user
 */
export function useUserDeposits(userAddress: string | undefined) {
  return useQuery({
    queryKey: ['userDeposits', userAddress],
    queryFn: async () => {
      if (!userAddress) return null;
      const data = await ponderClient.request<{
        deposits: {
          items: Array<{
            depositId: string;
            depositor: string;
            token: string;
            initialAmount: string;
            remainingAmount: string;
            isNative: boolean;
            released: boolean;
            createdAt: number;
            transfers: {
              items: Array<{
                transferId: string;
                status: string;
                receiver: string | null;
                amount: string | null;
                initiatedAt: number | null;
                completedAt: number | null;
              }>;
            };
          }>;
          totalCount: number;
        };
      }>(GET_USER_DEPOSITS, { user: userAddress.toLowerCase() });
      return data.deposits.items;
    },
    enabled: !!userAddress,
    refetchInterval: 10000, // Refetch setiap 10 detik
  });
}

/**
 * Get sent transfers for a user
 */
export function useUserSentTransfers(userAddress: string | undefined) {
  return useQuery({
    queryKey: ['userSentTransfers', userAddress],
    queryFn: async () => {
      if (!userAddress) return null;
      const data = await ponderClient.request<{
        transfers: {
          items: Array<{
            transferId: string;
            depositId: string;
            sender: string;
            receiver: string | null;
            amount: string | null;
            token: string | null;
            isNative: boolean | null;
            status: string;
            initiatedAt: number;
            completedAt: number | null;
          }>;
          totalCount: number;
        };
      }>(GET_USER_SENT_TRANSFERS, { user: userAddress.toLowerCase() });
      return data.transfers.items;
    },
    enabled: !!userAddress,
    refetchInterval: 10000,
  });
}

/**
 * Get received transfers for a user
 */
export function useUserReceivedTransfers(userAddress: string | undefined) {
  return useQuery({
    queryKey: ['userReceivedTransfers', userAddress],
    queryFn: async () => {
      if (!userAddress) return null;
      const data = await ponderClient.request<{
        transfers: {
          items: Array<{
            transferId: string;
            sender: string;
            receiver: string;
            amount: string | null;
            token: string | null;
            isNative: boolean | null;
            status: string;
            processedAt: number | null;
            completedAt: number | null;
          }>;
          totalCount: number;
        };
      }>(GET_USER_RECEIVED_TRANSFERS, { user: userAddress.toLowerCase() });
      return data.transfers.items;
    },
    enabled: !!userAddress,
    refetchInterval: 10000,
  });
}

/**
 * Get user activity feed
 */
export function useUserActivity(userAddress: string | undefined, limit = 50) {
  return useQuery({
    queryKey: ['userActivity', userAddress, limit],
    queryFn: async () => {
      if (!userAddress) return null;
      const data = await ponderClient.request<{
        userActivities: {
          items: Array<{
            id: string;
            type: 'DEPOSIT' | 'SEND' | 'RECEIVE';
            depositId: string | null;
            transferId: string | null;
            amount: string;
            token: string;
            isNative: boolean;
            timestamp: number;
            txHash: string;
            receiver: string | null;
            sender: string | null;
          }>;
          totalCount: number;
        };
      }>(GET_USER_ACTIVITY, { 
        user: userAddress.toLowerCase(),
        limit 
      });
      return data.userActivities.items;
    },
    enabled: !!userAddress,
    refetchInterval: 5000, // Refetch setiap 5 detik untuk activity feed
  });
}

/**
 * Get transfer by ID
 */
export function useTransfer(transferId: string | undefined) {
  return useQuery({
    queryKey: ['transfer', transferId],
    queryFn: async () => {
      if (!transferId) return null;
      const data = await ponderClient.request<{
        transfer: {
          transferId: string;
          depositId: string;
          sender: string;
          receiver: string | null;
          amount: string | null;
          token: string | null;
          isNative: boolean | null;
          status: string;
          initiatedAt: number;
          completedAt: number | null;
          deposit: {
            depositId: string;
            initialAmount: string;
            remainingAmount: string;
          };
        } | null;
      }>(GET_TRANSFER_BY_ID, { transferId });
      return data.transfer;
    },
    enabled: !!transferId,
    refetchInterval: 5000,
  });
}

/**
 * Get deposit by ID
 */
export function useDeposit(depositId: string | undefined) {
  return useQuery({
    queryKey: ['deposit', depositId],
    queryFn: async () => {
      if (!depositId) return null;
      const data = await ponderClient.request<{
        deposit: {
          depositId: string;
          depositor: string;
          initialAmount: string;
          remainingAmount: string;
          isNative: boolean;
          released: boolean;
          transfers: Array<{
            transferId: string;
            receiver: string | null;
            amount: string | null;
            status: string;
          }>;
        } | null;
      }>(GET_DEPOSIT_BY_ID, { depositId });
      return data.deposit;
    },
    enabled: !!depositId,
    refetchInterval: 10000,
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format amount untuk display
 */
export function formatAmount(amount: string | null | undefined, decimals = 18): string {
  if (!amount) return '0.00';
  try {
    return formatEther(BigInt(amount));
  } catch {
    return '0.00';
  }
}

/**
 * Get status color untuk UI
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'ACKNOWLEDGED':
      return 'blue';
    case 'STORED':
      return 'yellow';
    case 'PENDING':
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Format timestamp untuk display
 */
export function formatTimestamp(timestamp: number | null | undefined): string {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
}

