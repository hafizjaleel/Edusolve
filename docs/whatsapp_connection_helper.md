keep the base url in env: main.waappa.com

### 1. Create a New Session
```bash
curl -X POST http://localhost:3001/admin/sessions \
  -H "Authorization: YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My WhatsApp Session",
    "webhook_url": "https://your-server.com/webhook"
  }'
```
> Returns: `session_id`, `display_name`, `api_key`



### 4. Delete a Session
```bash
curl -X DELETE http://localhost:3001/admin/sessions/SESSION_NAME \
  -H "Authorization: YOUR_MASTER_KEY"
```
> ⚠️ Permanently removes session from DB and WAHA engine.

---

## ▶️ Session Lifecycle

### 5. Start a Session
```bash
curl -X POST http://localhost:3001/admin/sessions/SESSION_NAME/start \
  -H "Authorization: YOUR_MASTER_KEY"
```

---

### 6. Stop a Session
```bash
curl -X POST http://localhost:3001/admin/sessions/SESSION_NAME/stop \
  -H "Authorization: YOUR_MASTER_KEY"
```

---

### 7. Restart a Session
```bash
curl -X POST http://localhost:3001/admin/sessions/SESSION_NAME/restart \
  -H "Authorization: YOUR_MASTER_KEY"
```

---

### 8. Get QR Code (PNG image, auto-starts session if needed)
```bash
curl -X GET http://localhost:3001/admin/sessions/SESSION_NAME/qr \
  -H "Authorization: YOUR_MASTER_KEY" \
  --output qr.png
```
> Opens `qr.png` with the QR to scan. Auto-starts session if it's in `STOPPED` state.


### 10. Update Session Config (Webhooks, Ignore Rules, Proxy)
```bash
curl -X PATCH http://localhost:3001/admin/sessions/SESSION_NAME/config \
  -H "Authorization: YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://your-server.com/webhook",
    "config": {
      "webhooks": [
        {
          "url": "https://your-server.com/webhook",
          "events": ["message", "message.any", "message.ack"]
        }
      ]
    }
  }'
```

---

### 11. Regenerate Session API Key
```bash
curl -X POST http://localhost:3001/admin/sessions/SESSION_NAME/regenerate-key \
  -H "Authorization: YOUR_MASTER_KEY"
```
> Returns new `api_key` (old key is immediately invalidated)


## 📊 Session Observability

### 12. Get WhatsApp Profile (Connected Number Info)
```bash
curl -X GET http://localhost:3001/admin/sessions/SESSION_NAME/profile \
  -H "Authorization: YOUR_MASTER_KEY"
```
> Returns: `name`, `phone`, `profilePicUrl`, `status`, `engine`

---

### 13. Get API Logs (Paginated)
```bash
curl -X GET "http://localhost:3001/admin/sessions/SESSION_NAME/logs?page=1&limit=20" \
  -H "Authorization: YOUR_MASTER_KEY"
```

if we confiqgure a webhok we will recieve

============================================================ SESSION
EVENTS ============================================================

session.status

{ "event": "session.status", "session": "default", "payload": {
"status": "WORKING" } }

Statuses: STOPPED STARTING SCAN_QR_CODE WORKING FAILED

============================================================ MESSAGE
EVENTS ============================================================

message

{ "event": "message", "session": "default", "payload": { "id":
"true\_...", "timestamp": 1667561485, "from": "111@c.us", "body": "Hi",
"hasMedia": false, "ack": 1 } }

message.any (Same payload as message)

message.reaction

{ "event": "message.reaction", "payload": { "reaction": { "text": "🙏",
"messageId": "true\_..." } } }

message.ack

{ "event": "message.ack", "payload": { "ack": 3, "ackName": "READ" } }

ACK Status: ERROR (-1) PENDING (0) SERVER (1) DEVICE (2) READ (3) PLAYED
(4)

message.waiting message.edited message.revoked

============================================================ CHAT EVENTS
============================================================

chat.archive

{ "event": "chat.archive", "payload": { "id": "123@c.us", "archived":
true } }


  Method   Endpoint                        Description
  -------- ------------------------------- -----------------------
  POST     /api/sendText                   Send text
  POST     /api/sendImage                  Send image
  POST     /api/sendVideo                  Send video
  POST     /api/sendVoice                  Send voice note
  POST     /api/sendFile                   Send file
  POST     /api/sendList                   Send list message

  i will add sample curls for it.
