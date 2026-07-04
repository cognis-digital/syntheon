import { Client } from 'plaid';
import { isConfigured } from '@/lib/integrations/plaid/config';
import { cn } from '@/lib/utils';

type PlaidExampleOptions = {
  environment?: string;
  clientId: string;
};

const DEFAULT_OPTIONS: Required<PlaidExampleOptions> = {
  environment: 'sandbox',
  clientId: '',
};

export async function initializeClient(options: Partial<PlaidExampleOptions>) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured. Run setup first.');
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    return new Client({
      environment: config.environment,
      clientId: config.clientId,
      options: {
        clientName: 'Syntheon Example',
        language: 'en_US',
      },
    });
  } catch (error) {
    console.error('Failed to initialize Plaid:', error);
    throw new Error(`Plaid init failed: ${(error as Error).message}`);
  }
}

export async function createLinkSession(client: Client, options?: {
  user: { firstName: string; lastName: string };
  clientName: string;
}) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.linkToken.create({
      user: options?.user || { firstName: 'Demo', lastName: 'User' },
      clientName: options?.clientName || 'Syntheon Example',
      language: 'en_US',
      countryCodes: ['US'],
      initialLayout: 'inline',
    });

    return response.data;
  } catch (error) {
    console.error('Link session creation failed:', error);
    throw new Error(`Link session error: ${(error as Error).message}`);
  }
}

export async function exchangeToken(
  client: Client,
  linkToken: string,
  user: { firstName: string; lastName: string },
) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.linkToken.exchange({
      linkToken,
      user,
      clientName: 'Syntheon Example',
      language: 'en_US',
    });

    return response.data;
  } catch (error) {
    console.error('Token exchange failed:', error);
    throw new Error(`Exchange failed: ${(error as Error).message}`);
  }
}

export async function getAccounts(client: Client, accessToken: string) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.accounts.get({
      accessToken,
    });

    return response.data;
  } catch (error) {
    console.error('Account retrieval failed:', error);
    throw new Error(`Get accounts failed: ${(error as Error).message}`);
  }
}

export async function verifyAccount(
  client: Client,
  accessToken: string,
  accountId: string,
) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.accounts.verify({
      accessToken,
      accountId,
    });

    return response.data;
  } catch (error) {
    console.error('Account verification failed:', error);
    throw new Error(`Verify account failed: ${(error as Error).message}`);
  }
}

export async function getTransactions(
  client: Client,
  accessToken: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  },
) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.transactions.get({
      accessToken,
      startDate: options?.startDate,
      endDate: options?.endDate,
      limit: options?.limit || 25,
    });

    return response.data;
  } catch (error) {
    console.error('Transaction retrieval failed:', error);
    throw new Error(`Get transactions failed: ${(error as Error).message}`);
  }
}

export async function runFullFlowDemo() {
  if (!isConfigured()) {
    throw new Error('Plaid not configured. Run setup first.');
  }

  try {
    // Step 1: Initialize client
    const client = await initializeClient();

    // Step 2: Create link session (would open modal)
    const linkTokenResponse = await createLinkSession(client, {
      user: { firstName: 'Demo', lastName: 'User' },
      clientName: 'Syntheon Example',
    });

    console.log('Link token created:', linkTokenResponse.link_token);

    // Step 3: Exchange token (after user completes flow)
    const exchangeData = await exchangeToken(
      client,
      linkTokenResponse.link_token,
      { firstName: 'Demo', lastName: 'User' },
    );

    console.log('Exchange complete:', JSON.stringify(exchangeData, null, 2));

    // Step 4: Get accounts
    const accounts = await getAccounts(client, exchangeData.access_token);
    console.log('Accounts found:', accounts.data.length);

    // Step 5: Verify first account
    if (accounts.data[0]) {
      const verification = await verifyAccount(
        client,
        exchangeData.access_token,
        accounts.data[0].id,
      );
      console.log('Verification result:', JSON.stringify(verification, null, 2));

      // Step 6: Get transactions for verified account
      const transactions = await getTransactions(client, exchangeData.access_token);
      console.log('Transactions retrieved:', transactions.data.length);
    }

    return { success: true, accounts: accounts.data };
  } catch (error) {
    console.error('Full flow demo failed:', error);
    throw new Error(`Demo flow failed: ${(error as Error).message}`);
  }
}

export async function handleLinkError(
  client: Client,
  linkToken: string,
  errorData: any,
) {
  if (!isConfigured()) {
    throw new Error('Plaid not configured.');
  }

  try {
    const response = await client.linkToken.exchange({
      linkToken,
      user: { firstName: 'Demo', lastName: 'User' },
      clientName: 'Syntheon Example',
      language: 'en_US',
      errorData,
    });

    return response.data;
  } catch (error) {
    console.error('Error handling exchange failed:', error);
    throw new Error(`Error handle failed: ${(error as Error).message}`);
  }
}

export async function getPlaidStatus() {
  if (!isConfigured()) {
    return { configured: false, environment: null };
  }

  try {
    const client = await initializeClient();
    
    // Try a lightweight ping to verify connection
    const response = await client.linkToken.create({
      user: { firstName: 'Status', lastName: 'Check' },
      clientName: 'Syntheon Example',
      language: 'en_US',
    });

    return {
      configured: true,
      environment: (client as any).options.environment,
      linkTokenCreated: !!response.data.link_token,
    };
  } catch (error) {
    console.error('Status check failed:', error);
    return {
      configured: false,
      environment: null,
      error: (error as Error).message,
    };
  }
}

export async function cleanupResources(accessToken?: string) {
  if (!isConfigured()) {
    return;
  }

  try {
    const client = await initializeClient();

    // Note: Plaid doesn't have explicit "cleanup" for access tokens,
    // but we can log them for audit purposes.
    console.log('Cleanup started...');
    
    if (accessToken) {
      console.log('Access token logged:', accessToken.substring(0, 20) + '...');
    }

    return { success: true };
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw new Error(`Cleanup failed: ${(error as Error).message}`);
  }
}
