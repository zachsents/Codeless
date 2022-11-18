import { useEffect, useState } from 'react'
import { Button, Group, Loader, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { TbArrowNarrowRight } from 'react-icons/tb'
import AppDashboard from '../../../../components/AppDashboard'
import GoBackButton from '../../../../components/GoBackButton'
import { useApp, useCollectionCount, usePlan } from '../../../../modules/hooks'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { firestore, useMustBeSignedIn } from '../../../../modules/firebase'
import FormSection from '../../../../components/forms/FormSection'
import FormSubsection from '../../../../components/forms/FormSubsection'


export default function CreateCollection() {

    useMustBeSignedIn()

    const { query: { appId }, ...router } = useRouter()

    // check if user is maxed out on collections
    const app = useApp()
    const plan = usePlan(app?.plan)
    const collectionCount = useCollectionCount(appId)
    useEffect(() => {
        if (plan && collectionCount !== undefined && plan.flowCount <= collectionCount)
            router.push(`/app/${appId}/collections`)
    }, [plan, collectionCount])

    // form hook & handlers
    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: value => !value,
        },
    })
    const [formLoading, setFormLoading] = useState(false)

    const handleSubmit = async values => {
        setFormLoading(true)
        const newDocRef = await addDoc(collection(firestore, "apps", appId, "collections"), {
            name: values.name,
            created: serverTimestamp(),
            itemCount: 0,
        })
        router.push(`/app/${appId}/collection/${newDocRef.id}`)
    }


    return (
        <AppDashboard>
            <Group position="apart">
                <GoBackButton href={`/app/${appId}/collections`} />
            </Group>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <FormSection title="New Collection">
                    <FormSubsection label="Choose a name for your collection">
                        <TextInput
                            placeholder="People interested in Party Animal University hoodies"
                            disabled={formLoading}
                            {...form.getInputProps("name")}
                            sx={{ width: 400 }}
                        />
                    </FormSubsection>
                </FormSection>
                <FormSection>
                    {form.isValid() ?
                        formLoading ?
                            <Loader size="sm" /> :
                            <Button type="submit" rightIcon={<TbArrowNarrowRight />}>Create Collection</Button>
                        :
                        <></>
                    }
                </FormSection>
            </form>
        </AppDashboard>
    )
}
