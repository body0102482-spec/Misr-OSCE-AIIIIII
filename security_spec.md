# Firestore Security Specification

This document details the security model, invariants, and policies protecting the Misr OSCE app.

## 1. Data Invariants

1. **User Profile Integrity**: Registration is proxy-verified on the server, enforcing email uniqueness. Custom admin roles can never be self-assigned.
2. **Transaction Immutability**: Payment submissions can only be transitioned from `Pending` to `Approved` or `Declined` by verified administrators.

## 2. The Dirty Dozen Payloads (Security Testing scenarios)

Below are the 12 malicious payloads that must remain rejected by the security layer:

1. **Anonymously modifying email plans**: Bypassed local plan levels using unauthorized writes.
2. **Assigning oneself Admin status**: Setting `isAdmin: true` on standard registration.
3. **Poisoning case count variables**: Forcing `credits` to `99999` using direct client connections.
4. **Altering existing payment records**: Modifying a payment status from `Pending` to `Approved`.
5. **Deleting registration records**: Triggering arbitrary deletion of user collections.
6. **Hijacking other user records**: Attempting to read or edit profiles of other students.
7. **Junk string injection into document IDs**: Exploiting path variables by creating multi-megabyte ID values.
8. **Setting future expirations on trial accounts**: Manipulating `planExpiresAt` values.
9. **Deducting negative credits**: Sending integer overflows or decimals to inflate balance.
10. **Pre-approving payment tickets**: Registering approved dummy payment receipts.
11. **Spoofing email verifications**: Asserting unverified administrator status.
12. **Querying general database nodes**: Scraping the whole `/users` table via general collection queries.

## 3. Deployment Rules

The server proxy completely mediates access, thus we restrict direct public client write/read access and lock down external ports.
