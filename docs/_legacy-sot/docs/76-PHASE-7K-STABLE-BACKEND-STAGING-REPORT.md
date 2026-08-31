# Phase 7K Stable Backend Staging Report

Date: 2026-07-19
Status: BLOCKED — STABLE BACKEND ORIGIN NOT AVAILABLE

## Scope

Phase 7K checks whether the Git-connected Vercel frontend has a stable backend staging origin suitable for browser/device UAT and production-readiness smoke.

## Evidence

| Check | Result |
|---|---|
| `https://krtnmdgtlv2.vercel.app/create` | `HTTP/2 200` |
| `https://krtnmdgtlv2.vercel.app/api/v1/health` | `HTTP/2 502` |
| API error | `DNS_HOSTNAME_NOT_FOUND` |

## Finding

The Git-connected production frontend is correctly serving static files, but its API rewrite cannot reach a stable backend. This is expected because `frontend/vercel.json` is intentionally committed with a placeholder backend origin to avoid storing temporary tunnel URLs in Git.

## Required resolution

Choose and configure one stable backend option:

1. VPS/reverse proxy with Node.js 24 and MariaDB.
2. cPanel Passenger/Node Application Manager only if Node.js 24 is supported.
3. A managed staging backend host plus managed MySQL/MariaDB.
4. A named Cloudflare Tunnel with controlled DNS, not an account-less quick tunnel.

## Gate

Gate result: PHASE 7K BLOCKED.

Blocker: stable HTTPS backend staging origin is not available yet.
