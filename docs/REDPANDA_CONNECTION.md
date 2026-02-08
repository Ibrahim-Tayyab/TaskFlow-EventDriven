# RedPanda Cloud Connection Guide

## Quick Reference

| Setting | Value |
|---------|-------|
| **Bootstrap Server** | `d63t1k3t489913vp0dvg.any.us-east-1.mpx.prd.cloud.redpanda.com:9092` |
| **Security Protocol** | `SASL_SSL` |
| **SASL Mechanism** | `SCRAM-SHA-256` |
| **Username** | `todo-user` |
| **Password** | `todo-user` |

---

## Topics Required

| Topic Name | Purpose |
|------------|---------|
| `task-events` | Task CRUD events (create, update, delete, complete) |
| `notifications` | User notifications and alerts |
| `reminders` | Task reminder scheduling |

---

## Dapr pubsub.yaml Configuration

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: todo-pubsub
spec:
  type: pubsub.kafka
  version: v1
  initTimeout: 120s
  metadata:
  - name: brokers
    value: "d63t1k3t489913vp0dvg.any.us-east-1.mpx.prd.cloud.redpanda.com:9092"
  - name: consumerGroup
    value: "todo-group"
  - name: clientID
    value: "todo-client"
  - name: authType
    value: "password"
  - name: saslUsername
    value: "todo-user"
  - name: saslPassword
    value: "todo-user"
  # CRITICAL: Dapr uses "SHA-256" NOT "SCRAM-SHA-256"
  - name: saslMechanism
    value: "SHA-256"
  - name: disableTls
    value: "false"
  - name: skipVerify
    value: "true"
  - name: version
    value: "2.4.0"
  - name: consumeRetryInterval
    value: "500ms"
  - name: heartbeatInterval
    value: "5s"
  - name: sessionTimeout
    value: "30s"
  - name: initialOffset
    value: "newest"
```

---

## Python Direct Connection (for testing)

```python
from kafka import KafkaProducer
import ssl

context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

producer = KafkaProducer(
    bootstrap_servers='d63t1k3t489913vp0dvg.any.us-east-1.mpx.prd.cloud.redpanda.com:9092',
    security_protocol='SASL_SSL',
    sasl_mechanism='SCRAM-SHA-256',
    sasl_plain_username='todo-user',
    sasl_plain_password='todo-user',
    ssl_context=context,
    api_version=(3, 4, 0)
)
print("Connected to RedPanda Cloud!")
```

---

## Common Errors & Fixes

### Error: "client has run out of available brokers"
**Cause:** SASL mechanism mismatch  
**Fix:** In Dapr use `saslMechanism: "SHA-256"` (NOT "SCRAM-SHA-256")

### Error: "not authorized to access this topic"
**Cause:** Topic doesn't exist or ACL not configured  
**Fix:** 
1. Create missing topic in RedPanda Console → Topics → Create Topic
2. Verify ACLs: Security → ACLs → Ensure user has `Topics matching: "*"` with `All: allow`

### Error: "connection timeout"
**Cause:** Network/firewall blocking port 9092  
**Fix:** Test connection: `Test-NetConnection d63t1k3t489913vp0dvg.any.us-east-1.mpx.prd.cloud.redpanda.com -Port 9092`

---

## RedPanda Cloud Console

- **URL:** https://cloud.redpanda.com
- **Organization:** redpanda-org-4oivo7
- **Cluster:** teal-forest-camel

---

## Verified Working: February 8, 2026
