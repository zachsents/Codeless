

/**
 * Watches a Google Form.
 *
 * @export
 * @param {import("googleapis").forms_v1.Forms} formsApi
 * @param {object} [options]
 * @param {{ id: string }} [options.flow]
 * @param {string} [options.formId]
 */
export async function watchForm(formsApi, { flow, formId } = {}) {

    // Start watching
    await formsApi.forms.watches.create({
        formId,
        requestBody: {
            watchId: flow.id,
            watch: {
                target: {
                    topic: {
                        topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/googleforms-submit`
                    }
                },
                eventType: "RESPONSES",
            }
        }
    })
}


/**
 * Stops watching a Google Form.
 *
 * @export
 * @param {import("googleapis").forms_v1.Forms} formsApi
 * @param {object} [options]
 * @param {{ id: string }} [options.flow]
 * @param {string} [options.formId]
 */
export async function unwatchForm(formsApi, { flow, formId }) {

    // Stop watching
    await formsApi.forms.watches.delete({
        formId,
        watchId: flow.id,
    })
        .catch(() => { /* All good, we just weren't watching it */ })
}

