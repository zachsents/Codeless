import { Anchor, List, Space, Text, Title } from "@mantine/core"
import Section from "@web/components/Section"
import Footer from "@web/components/landing/Footer"
import Header from "@web/components/landing/Header"


const SPACING = "xl"


export default function PrivacyPolicyPage() {

    return (
        <>
            <Header />

            <main>
                <Section p="xl" stack stackProps={{ spacing: SPACING }}>
                    <Title order={1} align="center">
                        Privacy Policy
                    </Title>

                    <Text component="p">
                        Last Updated: June 13, 2023
                    </Text>

                    <List type="ordered" spacing={SPACING}>
                        <List.Item>
                            <b>Introduction</b>
                            <Text component="p">
                                Minus ("We", "Us", "Our", or "Minus") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you use our software ("Software") and tell you about your privacy rights and how the law protects you.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Personal Data We Collect</b>
                            <Text component="p">
                                We collect and process the following data:
                            </Text>

                            <List type="ordered">
                                <List.Item type="a">
                                    <b>Account Information</b>
                                    <Text component="p">
                                        When you sign up for an account, we collect information like your name, email address, and other details necessary to provide our services.
                                    </Text>
                                </List.Item>
                                <List.Item type="a">
                                    <b>Usage Information</b>
                                    <Text component="p">
                                        We collect information about your use of our Software, such as the features you use, the services you access, and the time, frequency, and duration of your activities.
                                    </Text>
                                </List.Item>
                                <List.Item type="a">
                                    <b>OAuth Tokens</b>
                                    <Text component="p">
                                        When you authorize us to connect with third-party integrations, we store OAuth tokens to perform operations on your behalf.
                                    </Text>
                                </List.Item>
                            </List>
                        </List.Item>

                        <List.Item>
                            <b>How We Use Your Personal Data</b>
                            <Text component="p">
                                We use your personal data for the following purposes:
                            </Text>

                            <List>
                                <List.Item>
                                    To provide our Software and its features to you.
                                </List.Item>
                                <List.Item>
                                    To process your transactions and bill you for your subscription.
                                </List.Item>
                                <List.Item>
                                    To communicate with you, including responding to your inquiries and sending important notices.
                                </List.Item>
                                <List.Item>
                                    To improve our Software, including troubleshooting, data analysis, and research.
                                </List.Item>
                            </List>
                        </List.Item>

                        <List.Item>
                            <b>Data Retention</b>
                            <Text component="p">
                                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Data Sharing and Transfer</b>
                            <Text component="p">
                                Your personal data may be shared with or transferred to third-party services that you authorize us to connect with. These third-party services are not controlled by us and have their own privacy policies.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Security</b>
                            <Text component="p">
                                We are committed to ensuring the security of your personal data and take reasonable measures to protect it from unauthorized access, alteration, disclosure, or destruction. All user data is stored with <Anchor href="https://firebase.google.com/" target="_blank">Firebase</Anchor>, a reputable third-party service by Google, which employs robust security measures. However, we cannot guarantee that your data will always be secure.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Your Rights</b>
                            <Text component="p">
                                Depending on your jurisdiction, you may have certain rights regarding your personal data, such as the right to access, correct, delete, or restrict the use of your personal data.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Changes to This Privacy Policy</b>
                            <Text component="p">
                                We reserve the right to modify this Privacy Policy at any time. If we make changes, we will notify you by revising the date at the top of the Privacy Policy, and in some cases, we may provide you with additional notice.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Contact Information</b>
                            <Text component="p">
                                If you have any questions about this Privacy Policy, you can contact us at <Anchor href="mailto:info@minuscode.app" target="_blank">info@minuscode.app</Anchor>.
                            </Text>
                        </List.Item>
                    </List>
                </Section>



                <Space h="5rem" />

                <Footer />
            </main>
        </>
    )
}
