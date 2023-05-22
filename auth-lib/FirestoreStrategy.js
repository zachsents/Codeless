import { Strategy } from "./Strategy.js"


/**
 * @typedef {object} FirestoreStrategyOptions
 * 
 * @property {import("firebase-admin").firestore.Firestore} database
 * 
 * @property {string} stateCollection
 * @property {string} accountCollection
 * @property {string} accountKeyPrefix
 * 
 * @property {boolean} getAccessTokenInsideTransaction
 * 
 */




export class FirestoreStrategy extends Strategy {

    /**
     * Creates an instance of FirestoreStrategy.
     * @param {FirestoreStrategyOptions} options
     * @memberof FirestoreStrategy
     */
    constructor(options) {
        super()
        this.options = options
    }

    get db() {
        return this.options.database
    }

    /**
     * Use the options from this strategy.
     *
     * @return {import("./ServerOAuth2Manager.js").ServerOAuth2ManagerOptions} 
     * @memberof FirestoreStrategy
     */
    useOptions() {
        return {
            /**
             * Get state from database
             */
            getState: async (state) => {
                const stateDoc = await this.db
                    .collection(this.options.stateCollection)
                    .doc(state)
                    .get()

                return stateDoc.exists ? stateDoc.data() : null
            },

            /**
             * Set state in database
             */
            setState: async (stateData) => {
                await this.db
                    .collection(this.options.stateCollection)
                    .doc(stateData.state)
                    .set(stateData, { merge: true })
            },

            /**
             * Get auth info from database -- inside a transaction if provided
             * @param {import("firebase-admin").firestore.DocumentReference} accountRef
             */
            getAuthInfo: async (accountId, { transaction } = {}) => {
                const accountRef = this.db.collection(this.options.accountCollection).doc(accountId)

                // Get doc - either with transaction or not
                const accountDoc = transaction ?
                    await transaction.get(accountRef) :
                    await accountRef.get()

                // Return data
                return accountDoc.exists ? accountDoc.data() : null
            },

            /**
             * Set auth info in database -- inside a transaction if provided
             */
            setAuthInfo: async (accountId, { payload, ...info }, { transaction } = {}) => {
                console.log("TO DO: use payload to link account to app", payload)

                const accountRef = this.db.collection(this.options.accountCollection).doc(accountId)

                // Use transaction if provided
                if (transaction)
                    return await transaction.set(accountRef, info, { merge: true })

                // Otherwise, just set the doc
                await accountRef.set(info, { merge: true })
            },

            /**
             * Create account key -- a document ref
             */
            createAccountKey: userId => this.db.collection(this.options.accountCollection).doc(`${this.options.accountKeyPrefix}${userId}`),
        }
    }

    /**
     * Use function overrides from this strategy.
     *
     * @param {import("./ServerOAuth2Manager.js").ServerOAuth2Manager} manager
     * @memberof FirestoreStrategy
     */
    useFunctionOverrides(manager) {
        const functionOverrides = {}

        if (this.options.getAccessTokenInsideTransaction) {
            const _getAccessToken = manager.getAccessToken.bind(manager)

            functionOverrides.getAccessToken = (accountId, additionalState = {}) => {
                // Get access token inside transaction
                return this.db.runTransaction(async transaction => {
                    return await _getAccessToken(
                        accountId,
                        { transaction, ...additionalState }
                    )
                })
            }
        }

        return functionOverrides
    }
}