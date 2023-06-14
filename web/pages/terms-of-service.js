import { Divider, List, Space, Text, Title } from "@mantine/core"
import Section from "@web/components/Section"
import Footer from "@web/components/landing/Footer"
import Header from "@web/components/landing/Header"


const SPACING = "xl"


export default function TermsOfServicePage() {

    return (
        <>
            <Header />

            <main>
                <Section p="xl" stack stackProps={{ spacing: SPACING }}>
                    <Title order={1} align="center">
                        Terms of Service
                    </Title>

                    <Text component="p">
                        This is an agreement ("Agreement") between you ("User", "You", or "Your") and Minus ("We", "Us", "Our", or "Minus"), the provider of the Minus software application ("Software").
                    </Text>

                    <List>
                        <Text>
                            In this Agreement:
                        </Text>
                        <List.Item>
                            <b>"Software"</b> refers to our Minus application, which is a tool that enables Users to build business automations using a flowchart-like graph builder. This includes any other services, features, content, or applications offered from time to time by Minus.
                        </List.Item>
                        <List.Item>
                            <b>"User" or "You"</b> refers to the individual or entity that has agreed to this Agreement and is using the Software.
                        </List.Item>
                        <List.Item>
                            <b>"Third Party Integrations"</b> refers to other online platforms or services that the Software can interact with, including but not limited to Gmail, Google Sheets, OpenAI, Discord, Slack, etc.
                        </List.Item>
                        <List.Item>
                            <b>"OAuth Tokens"</b> are access tokens that are used to authorize the Software to interact with Third Party Integrations on behalf of the User.
                        </List.Item>
                        <List.Item>
                            <b>"Subscription"</b> refers to the monthly plan chosen by the User to access and use the Software, with different tiers offering different feature sets.
                        </List.Item>
                        <List.Item>
                            <b>"Privacy Policy"</b> refers to Minus's policy on how it collects, uses, and manages User data, including OAuth Tokens.
                        </List.Item>
                    </List>

                    <Text component="p">
                        Please read this Agreement carefully before using the Software. By accessing or using the Software, you agree to be bound by this Agreement and to the collection and use of your information as set forth in the Minus Privacy Policy, among other terms. If you disagree with any part of the terms, then you may not access the Software.
                    </Text>

                    <Divider />

                    <List type="ordered" spacing={SPACING}>
                        <List.Item>
                            <b>Acceptance of Terms</b>
                            <Text component="p">
                                By accessing and using our software ("Software"), you agree to comply with and be legally bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you are not authorized to use our Software.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>User Requirements</b>
                            <Text component="p">
                                To access our Software, you must be at least the age of majority in your jurisdiction. You represent that you are not barred from receiving services under applicable laws, can form legally binding contracts, and you are using the Software for business purposes.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>License to Use</b>
                            <Text component="p">
                                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to use our Software. You agree not to use, copy, modify, sell, lease, distribute, or create derivative works based on our Software or any part of it, other than as expressly allowed under these Terms.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <b>Third Party Integrations</b>
                            <Text component="p">
                                Our Software allows integration with third-party services, like Gmail, Google Sheets, OpenAI, Discord, Slack, etc. We do not control these third-party services and are not responsible for their availability or functionality. Your use of these services is governed by their respective terms of service and privacy policies.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <b>User Conduct</b>
                            <Text component="p">
                                You agree not to use our Software to violate any laws or regulations, send spam or unsolicited messages, spread viruses or other harmful computer code, infringe the intellectual property rights of others, or do anything that could interfere with or disrupt our Software.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>User Data and Privacy</b>
                            <Text component="p">
                                In order to provide our services, we may need to store OAuth tokens and other data on your behalf. This data will be stored and handled in accordance with our Privacy Policy. By using our Software, you consent to such processing and you warrant that all data provided by you is accurate.
                            </Text>
                        </List.Item>
                        <List.Item>
                            <b>Subscription and Payment</b>
                            <Text component="p">
                                Use of our Software is subject to a monthly subscription fee. Different subscription tiers, each including different feature sets, are available. The fees for each subscription tier are listed on our website. You agree to pay the fees for the subscription tier that you select, and you understand that your access to our Software may be suspended if you fail to pay these fees.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Termination</b>
                            <Text component="p">
                                We may terminate your access to our Software at any time, for any reason, and without notice. Upon termination, all rights granted to you under these Terms will immediately cease.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Disclaimer of Warranties and Limitation of Liability</b>
                            <Text component="p">
                                Our Software is provided "as is," without warranty of any kind. We disclaim all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We will not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our Software.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Indemnification</b>
                            <Text component="p">
                                You agree to indemnify and hold us harmless from any claim or demand made by any third party due to or arising out of your breach of these Terms, your violation of any law, or your infringement of the rights of a third party through the use of our Software.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Dispute Resolution</b>
                            <Text component="p">
                                Any dispute arising from these Terms will be governed by the laws of the state of Colorado, without regard to its conflict of law provisions.
                            </Text>
                        </List.Item>

                        <List.Item>
                            <b>Changes to Terms</b>
                            <Text component="p">
                                We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email, providing a notice through our Software, or updating the date at the top of these Terms.
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
