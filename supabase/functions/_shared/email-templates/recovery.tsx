/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

const DEFAULT_LOGO = 'https://wzppyqkgluskxiakdtiw.supabase.co/storage/v1/object/public/email-assets/adriken-logo.png'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
  logoUrl?: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
  logoUrl = DEFAULT_LOGO,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your {siteName} password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={logoUrl} alt="Adriken" width="48" height="48" style={logo} />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for {siteName}. Tap the button below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset My Password
        </Button>
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email — your password won't change.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Manrope', system-ui, -apple-system, sans-serif" }
const container = { padding: '32px 28px' }
const logo = { marginBottom: '20px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: 'hsl(220, 20%, 10%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: 'hsl(220, 10%, 46%)',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: 'hsl(12, 76%, 56%)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
