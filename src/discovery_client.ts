import { Client } from "./client";
import {
    DiscoveryStats,
    GenericResponse,
    SyncStatus,
    UpdateSyncStatusRequest,
    RegisterToDiscoveryRequest,
    ReplicaType,
} from "./models";

/**
 * Discovery client for managing service discovery and replication
 */
export class DiscoveryClient extends Client {
    /**
     * Gets Shilp statistics for a given account
     */
    async getShilpStats(accountId: string): Promise<DiscoveryStats> {
        return this.doRequest<DiscoveryStats>(
            "GET",
            "/control/shilp/stats",
            undefined,
            { account_id: accountId }
        );
    }

    /**
     * Updates the sync status for a Shilp service
     */
    async updateShilpSyncStatus(
        accountId: string,
        address: string,
        status: SyncStatus
    ): Promise<GenericResponse> {
        const req: UpdateSyncStatusRequest = {
            account_id: accountId,
            address,
            status,
        };
        return this.doRequest<GenericResponse>(
            "POST",
            "/control/shilp/sync-status",
            req
        );
    }

    /**
     * Registers a Shilp service with the discovery system
     */
    async registerShilpService(
        accountId: string,
        address: string,
        id: string,
        replicaType: ReplicaType
    ): Promise<void> {
        const registrationData: RegisterToDiscoveryRequest = {
            account_id: accountId,
            address,
            id,
            is_read: false,
            is_write: false,
        };

        switch (replicaType) {
            case ReplicaType.ReadReplica:
                registrationData.is_read = true;
                break;
            case ReplicaType.WriteReplica:
                registrationData.is_write = true;
                break;
        }

        if (replicaType !== ReplicaType.SingleNode) {
            await this.registerationShilp(registrationData, true);
            return;
        }

        // For SingleNode, register both read and write
        registrationData.is_read = true;
        await this.registerationShilp(registrationData, true);

        registrationData.is_read = false;
        registrationData.is_write = true;
        await this.registerationShilp(registrationData, true);
    }

    /**
     * Unregisters a Shilp service from the discovery system
     */
    async unregisterShilpService(
        accountId: string,
        address: string,
        id: string,
        replicaType: ReplicaType
    ): Promise<void> {
        const registrationData: RegisterToDiscoveryRequest = {
            account_id: accountId,
            address,
            id,
            is_read: false,
            is_write: false,
        };

        switch (replicaType) {
            case ReplicaType.ReadReplica:
                registrationData.is_read = true;
                break;
            case ReplicaType.WriteReplica:
                registrationData.is_write = true;
                break;
        }

        if (replicaType !== ReplicaType.SingleNode) {
            await this.registerationShilp(registrationData, false);
            return;
        }

        // For SingleNode, unregister both read and write
        registrationData.is_read = true;
        await this.registerationShilp(registrationData, false);

        registrationData.is_read = false;
        registrationData.is_write = true;
        await this.registerationShilp(registrationData, false);
    }

    /**
     * Registers a TEI (Text Embedding Inference) service with the discovery system
     */
    async registerTeiService(
        accountId: string,
        address: string,
        id: string
    ): Promise<void> {
        const registrationData: RegisterToDiscoveryRequest = {
            account_id: accountId,
            address,
            id,
            is_read: true,
            is_write: false,
        };

        await this.doRequest<void>(
            "POST",
            "/control/tei/register",
            registrationData
        );
    }

    /**
     * Unregisters a TEI (Text Embedding Inference) service from the discovery system
     */
    async unregisterTeiService(
        accountId: string,
        address: string,
        id: string
    ): Promise<void> {
        const registrationData: RegisterToDiscoveryRequest = {
            account_id: accountId,
            address,
            id,
            is_read: true,
            is_write: false,
        };

        await this.doRequest<void>(
            "POST",
            "/control/tei/unregister",
            registrationData
        );
    }

    /**
     * Private helper method for Shilp registration/unregistration
     */
    private async registerationShilp(
        payload: RegisterToDiscoveryRequest,
        isRegistration: boolean
    ): Promise<GenericResponse> {
        const endpoint = isRegistration ? "register" : "unregister";
        return this.doRequest<GenericResponse>(
            "POST",
            `/control/shilp/${endpoint}`,
            payload
        );
    }
}
