Host capabilities (backend-complete target)

A HOST can ->
Create a place
Edit place details
Enable / Disable bookings
Update event dates (within hosting validity)
Update capacity
Update price
Invite / remove security
View analytics (later)
as host click remove security then he will not be able to login again as a security for that place.



now i will tell you the system flow how we want our app to work.
initially a user will register.
 on home page he will see all events to be held after that day or whose bookings are open .
  in nav he will have a option to host an event where he will be redirected to free plan which is default .
 later we will add subscription system. in free plan later, we will allow to host only one day event for one user in lifetime then he can not use free subscription. when visitor enter event details then we will calculate the event duration and check if user has valid subscription then ,are those dates inside that subscription period or not.
 if not , then we will redirect him to page where he will get list of subscriptions applicable for that event period .
  after creating event , he can access list of events hosted by him till now and to be hosted. 
  inside to be hosted events he can assign security where he will invite security mail and from mail, security can login to it and using that password it will automatically be assigned role security then provide password change for security.security assigned for a place have the authority to scan passes for check-in and check-out at that place.
for security, we will provide a enter as security option inside place details. clicking which will take input of id and password (with also an option to change password redirecting to form which will take current password and new password .) checking he is assigned to that place in that date or not. if assigned, then he can scan qr.

similarly super admin can invite admin via mail and give him a password on mail if he will enter that password with email during login than he will be directed to admin dashboard where he has the power to cancel events and to disable host causing auto refunds in case of disputes or orders from higher authority. during disabling host , all events related to host in future will get cancelled due to hostvalidity not available for them and auto refund will take place . in such case all visitor's whose passes got cancelled will get mail related to cancellation of event and the reason.and also to the host with the reason. 

we also provided cancellation facility in such a way that only the person who booked the passes can cancel ticket.and in case of multiple passes, he can perform partial cancellation.

❗ Prevent double booking beyond daily capacity
❗ Expire passes automatically after visitDate
❗ Prevent admin from disabling SUPER_ADMIN
❗ Prevent host from editing past events
❗ Prevent security scanning outside eventDates

we should provide option on home page to visitor to show his hosted events. if no events hosted yet then will show that no events hosted . similarly we will also give on opening past events host can see the analytics inside like which security had more scans and other analytics.
he will get details of security assigned for that past event . and for future events or events that are running he will get details of security persons assigned with their time like when to which date. an d will provide an option to remove from security causing security not be able to enter again as security on that place till removal or disable.

home page must excludes the cancelled events.
security analytics must be immutable.
host cannot modify past events.





User Capabilities by Role:

VISITOR:
✓ Browse events
✓ Book tickets
✓ View my passes
✓ Cancel bookings
✗ Create events
✗ Invite security

HOST (VISITOR + Extra Powers):
✓ Everything VISITOR can do
✓ Create events/places
✓ Manage own events
✓ Invite security personnel
✓ View event analytics
✗ Manage other hosts' events
✗ Delete any user

ADMIN:
✓ Manage all users
✓ Disable hosts
✓ Cancel any event
✓ View system analytics

SUPER_ADMIN:
✓ Everything
✓ Create/disable admins



visitor-pass/
└── backend/
    ├── .env
    └── src/
        ├── app.js
        ├── config/
        │   ├── env.js
        │   └── mail.js
        ├── controllers/
        │   ├── admin.js
        │   ├── adminanalytics.js
        │   ├── adminemergency.js
        │   ├── auth.js
        │   ├── host.js
        │   ├── hostanalytics.js
        │   ├── hostsubscription.js
        │   ├── pass.js
        │   ├── payment.js
        │   ├── placeanalytics.js
        │   ├── placecreation.js
        │   ├── refund.js
        │   ├── scancontroller.js
        │   ├── security-login.js
        │   ├── subscription.js
        │   └── visitor.js
        ├── middlewares/
        │   ├── auth.js
        │   ├── hostingactive.js
        │   ├── role.js
        │   └── securityauth.js
        ├── models/
        │   ├── adminactionlog.js
        │   ├── hostsubscription.js
        │   ├── pass.js
        │   ├── payment.js
        │   ├── place.js
        │   ├── scanlog.js
        │   ├── security.js
        │   ├── subscription.js
        │   └── user.js
        ├── routes/
        │   ├── adminrouter.js
        │   ├── analyticsrouter.js
        │   ├── authrouter.js
        │   ├── hostrouter.js
        │   ├── hostsubscription.js
        │   ├── passrouter.js
        │   ├── placerouter.js
        │   ├── securityrouter.js
        │   └── subscriptionrouter.js
        ├── services/
        │   ├── admincancelmail.js
        │   ├── admininvitemail.js
        │   ├── createadmin.js
        │   ├── email.js
        │   ├── qr.js
        │   ├── refundmail.js
        │   └── token.js
        ├── templates/
        │   ├── passEmail.js
        │   └── securityinvitemail.js
        └── utils/
            ├── adminemergencyhelper.js
            ├── hostingvalidity.js
            ├── refundhelper.js
            └── refundpolicy.js


          we will working with different roles , we seeded super admin , which is irreplaceable. he can invite admins via mail and give them a temporary password . whether invited ones are registered or not . they on login with those email and password will set their role as admin. only super admin can remove/disable someone from admin. 
admin and super admin has the power to disable a host by auto cancelling all future events to be hosted by the host  or cancel an specific event with a specific reason. this decision will lead to all pass bearers of those cancelled events to get their money auto refunded and an e-mail of sorry for the inconvenience and informing them about their pass cancellation due to event cancellation. also when refund payment will be completed , all people who will get refund will receive mail of refund completed.
admin can also see all analytics like traffic on the app, total no. of bookings happening on each day. 
we also want to implement a subscription system on app .
when any user logins, he will be a normal visitor. and on nav we will provide an option to host an event . clicking which will lead to create-place form. form will also take image from gallery or image url .on submitting form , it will auto-check that event dates are within subscription period. for now we are making default subscription for 7 day for testing reasons later we will make it for 1 day and 1 time only so make code accordingly. this default subscription will be auto activated for all users . we will check if event dates are not valid for user's subscription or default then we will redirect him to subscriptions page and will show only those subscriptions which will be applicable for that event duration and dates. 
we will also provide an option in nav to see visitor's events. clicking which will redirect him to page with all his events of past ,present and future. all of them will be shown in form of cards such that their will be an image related to event and price , event dates, duration, and get details button which will redirect him to page with complete event details . inside their he will have option to invite security for that place or event via mail similarly as for admin.
on cards , he will have option to edit event dates and update capacity. in event details he will also see assigned security members and can remove any security from there or invite security.

also host  can set refund during place creation like cancellation before 1 day of event then 80% refund or on event date then 50% . if no cancellation and no check in also, then pass will auto expire with no refund. it's all on the host if he want refund policy or no refund. during pass booking system , if their will be pass-price greater than 0 . then before proceeding towards payment it will show the conditions of refund policy and if vistor accepts it can we can proceed to payment . in case of paid passes, their will be no confirm booking before payment completion. seat no. and passes will be allotted only after payment completion.



  for visitor , he will get all event related info on home page in form of cards . all cards will have a book now option and enter as a security option. if he will press book now, then he will be redirected to createbooking , where he will have option to book any number of passes less than equal to 6 at a single time. for now we will create all places with ticket price 0 so, design in such a way that if ticket price==0, then no need of payment gateway shown , otherwise take payment . after payment confirmation, he will be redirected to his bookings which will be provided in the home nav. visitor will receive mail regarding pass confirmation. and all guests will also get their pass confirmation mail.  In guest's mail they will get QR's  also related to their pass info which they will show and security will scan for check-in and check-out.  when a user assigned as a security for some place or event then he can enter that event on home page and  will get an option of enter as a security where he will be asked for that temporary password mailed by host of that event.  he will also have the option to change his password.  remember he will be security for that event only , for others he will be a visitor. anyone with any roles can book passes. when security person enters as security on authentication, then he will have option to scan QR's on the passes of visitors during the event. on scanning, it will automatically register check in time and check out time . if user is checked out, it will not allow visitor to take entry. he will also have dashboard , where he can see his statistics like how many scans he made each date and how many check-in's happened by his scanning .

   we will also manage seat no. /slot for each pass in that event and will also track remaining vacant seats as per host's decided capacity.  for each place host will have toggle booking option to start and end the booking or to disable booking for some time and can also enable booking by that toggler.

also we will add a toggler for light and dark theme.




1. SETUP PHASE
   ├─ Register Admin → Login Admin
   ├─ Register Host → Login Host
   ├─ Register Visitor → Login Visitor
   └─ Host creates Place → Host creates Event

2. BOOKING & PASSES PHASE
   ├─ Visitor books Event
   ├─ Test getMyPasses (should show 1 active pass)
   ├─ Test getAllBookingsByVisitor (should show 1 booking)
   └─ Difference: getMyPasses = active only, getAllBookings = all history

3. HOST MANAGEMENT PHASE
   ├─ Test getMyPlaces (should show 1 place)
   ├─ Test getMyHostedEvents (should show 1 event)
   ├─ Difference: getMyPlaces = venues owned, getMyHostedEvents = events at those venues
   ├─ Edit Place → Update Capacity
   ├─ Get Slots → Update Event Dates
   └─ Toggle Booking (disable/enable)

4. SECURITY PHASE
   ├─ Host invites Security → Security accepts invite
   ├─ Security logs in → Get Security Dashboard
   ├─ Visitor arrives → Security scans pass
   ├─ Check Security Activity
   └─ Test invalid scan scenarios

5. ANALYTICS PHASE
   ├─ Admin: Get All Users → Get All Passes
   ├─ Admin: Get Peak Activity
   ├─ Admin: Get Avg Visit Duration
   ├─ Admin: Get Traffic by Place
   ├─ Host: Get Bookings Per Day
   ├─ Host: Get Peak Check-in Hours
   └─ Host: Get Place Dashboard

6. SUBSCRIPTION PHASE
   ├─ Host: Purchase Subscription
   ├─ Host: Toggle Plan (upgrade/downgrade)
   └─ Verify feature access changes

7. MODERATION PHASE
   ├─ Admin: Disable User
   ├─ Admin: Disable Host (check events cancelled)
   ├─ Admin: Cancel Event
   └─ Test Initiate Refund

8. PUBLIC APIS PHASE
   ├─ Get All Places (no auth)
   ├─ Search Places
   ├─ Get Place by ID
   └─ These feed the HOME PAGE





   // ----------complete api testing flow ----------- //
   # Complete API Testing Flow - Event Management System

## 🔧 Setup Phase

### 1. Start Server
```bash
npm install
npm start
# Server should run on http://localhost:5000
```

### 2. Verify Server
```http
GET http://localhost:5000/
```
Expected: Server info with all endpoints

---

## 📋 PHASE 1: Authentication & User Setup

### 1.1 Register Super Admin (Auto-seeded)
- Super Admin credentials from `.env` file
- Email: `SUPER_ADMIN_EMAIL`
- Password: `SUPER_ADMIN_PASSWORD`

### 1.2 Login as Super Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "superadminpass"
}
```
**Save token as:** `SUPER_ADMIN_TOKEN`

### 1.3 Register Visitor
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Visitor",
  "email": "john@example.com",
  "password": "password123",
  "role": "VISITOR"
}
```
**Save token as:** `VISITOR_TOKEN`

### 1.4 Register Host
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Alice Host",
  "email": "alice@example.com",
  "password": "password123",
  "role": "HOST"
}
```
**Save token as:** `HOST_TOKEN`

### 1.5 Get My Profile
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer {{VISITOR_TOKEN}}
```

---

## 🏢 PHASE 2: Admin Operations

### 2.1 Invite Admin (SUPER_ADMIN only)
```http
POST http://localhost:5000/api/admin/invite
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "email": "admin@example.com",
  "name": "Bob Admin"
}
```

### 2.2 Get All Users
```http
GET http://localhost:5000/api/admin/users?page=1&limit=20
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 2.3 Get All Passes
```http
GET http://localhost:5000/api/admin/passes?status=APPROVED&page=1
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 2.4 Disable User
```http
PATCH http://localhost:5000/api/admin/users/{{USER_ID}}/disable
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "reason": "Violated terms of service"
}
```

### 2.5 Disable Admin
```http
POST http://localhost:5000/api/admin/disable/{{ADMIN_ID}}
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "reason": "Access revoked"
}
```

### 2.6 Disable Host
```http
POST http://localhost:5000/api/admin/hosts/{{HOST_ID}}/disable
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "reason": "Multiple complaints received"
}
```

### 2.7 Cancel Event (Admin Emergency)
```http
POST http://localhost:5000/api/admin/places/{{PLACE_ID}}/cancel
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "reason": "Safety concerns",
  "refundAll": true
}
```

---

## 💰 PHASE 3: Subscription Management

### 3.1 Create Subscription Plan (SUPER_ADMIN)
```http
POST http://localhost:5000/api/subscriptions
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Content-Type: application/json

{
  "name": "Premium Monthly",
  "price": 999,
  "durationDays": 30,
  "description": "Premium hosting plan",
  "features": ["Unlimited events", "Advanced analytics", "Priority support"]
}
```
**Save as:** `PLAN_ID`

### 3.2 Get All Plans (Public)
```http
GET http://localhost:5000/api/subscriptions
```

### 3.3 Get Applicable Plans
```http
GET http://localhost:5000/api/subscriptions/applicable?durationDays=30
Authorization: Bearer {{HOST_TOKEN}}
```

### 3.4 Toggle Plan Active/Inactive
```http
PATCH http://localhost:5000/api/subscriptions/{{PLAN_ID}}/toggle
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 3.5 Purchase Subscription (Host)
```http
POST http://localhost:5000/api/host-subscription/purchase
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "planId": "{{PLAN_ID}}",
  "startDate": "2025-01-15"
}
```

---

## 🏛️ PHASE 4: Host - Place & Event Management

### 4.1 Create Place/Event
```http
POST http://localhost:5000/api/host/place
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "name": "Tech Conference Hall",
  "location": "123 Main St, Chennai",
  "image": "https://example.com/image.jpg",
  "eventDates": {
    "start": "2025-02-01",
    "end": "2025-02-05"
  },
  "price": 500,
  "dailyCapacity": 100,
  "refundPolicy": {
    "isRefundable": true,
    "beforeVisitPercent": 80,
    "sameDayPercent": 50,
    "description": "Standard refund policy"
  }
}
```
**Save as:** `PLACE_ID`

### 4.2 Get My Places
```http
GET http://localhost:5000/api/host/places
Authorization: Bearer {{HOST_TOKEN}}
```

### 4.3 Get My Hosted Events
```http
GET http://localhost:5000/api/host/events?status=upcoming
Authorization: Bearer {{HOST_TOKEN}}
```

**Difference:**
- `getMyPlaces`: Returns PLACES/VENUES with capacity, amenities
- `getMyHostedEvents`: Returns EVENTS with dates, bookings, revenue

### 4.4 Get Place Dashboard
```http
GET http://localhost:5000/api/host/places/{{PLACE_ID}}/dashboard
Authorization: Bearer {{HOST_TOKEN}}
```

### 4.5 Edit Place
```http
PUT http://localhost:5000/api/host/places/{{PLACE_ID}}
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "name": "Grand Tech Conference Hall",
  "dailyCapacity": 150
}
```

### 4.6 Update Capacity
```http
PATCH http://localhost:5000/api/host/places/{{PLACE_ID}}/capacity
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "dailyCapacity": 200
}
```

### 4.7 Toggle Booking (Enable/Disable)
```http
POST http://localhost:5000/api/host/places/{{PLACE_ID}}/toggle-booking
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "reason": "Maintenance scheduled"
}
```

### 4.8 Update Event Dates
```http
PATCH http://localhost:5000/api/host/events/{{PLACE_ID}}/dates
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "date": "2025-02-15",
  "startTime": "10:00",
  "endTime": "18:00"
}
```

### 4.9 Get Available Slots
```http
GET http://localhost:5000/api/host/places/{{PLACE_ID}}/slots?date=2025-02-01
Authorization: Bearer {{HOST_TOKEN}}
```

### 4.10 Manual Override
```http
POST http://localhost:5000/api/host/events/{{PLACE_ID}}/manual-override
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "type": "capacity",
  "newValue": 250,
  "reason": "VIP section added"
}
```

---

## 👥 PHASE 5: Security Personnel Management

### 5.1 Invite Security (Host)
```http
POST http://localhost:5000/api/host/places/{{PLACE_ID}}/invite-security
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json

{
  "email": "security@example.com",
  "assignmentPeriod": {
    "start": "2025-02-01",
    "end": "2025-02-05"
  }
}
```
**Save as:** `SECURITY_ID`

### 5.2 Accept Security Invite
```http
GET http://localhost:5000/api/security/accept/{{SECURITY_ID}}
```
OR with password setup:
```http
POST http://localhost:5000/api/security/accept-invite/{{INVITE_TOKEN}}
Content-Type: application/json

{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### 5.3 Login as Security
```http
POST http://localhost:5000/api/security/login
Content-Type: application/json

{
  "email": "security@example.com",
  "password": "temppassword",
  "placeId": "{{PLACE_ID}}"
}
```
**Save token as:** `SECURITY_TOKEN`

### 5.4 Change Password (Security)
```http
POST http://localhost:5000/api/security/change-password
Authorization: Bearer {{SECURITY_TOKEN}}
Content-Type: application/json

{
  "currentPassword": "temppassword",
  "newPassword": "newsecurepass123",
  "confirmPassword": "newsecurepass123"
}
```

### 5.5 Get Security Dashboard
```http
GET http://localhost:5000/api/security/dashboard
Authorization: Bearer {{SECURITY_TOKEN}}
```

### 5.6 Scan Pass (QR Code)
```http
POST http://localhost:5000/api/security/scan-pass
Authorization: Bearer {{SECURITY_TOKEN}}
Content-Type: application/json

{
  "qrCode": "{{PASS_ID}}|{{QR_TOKEN}}",
  "eventId": "{{PLACE_ID}}"
}
```

### 5.7 Get Security Activity
```http
GET http://localhost:5000/api/security/activity?date=2025-02-01
Authorization: Bearer {{SECURITY_TOKEN}}
```

### 5.8 Remove Security (Host)
```http
DELETE http://localhost:5000/api/host/places/{{PLACE_ID}}/security/{{SECURITY_ID}}
Authorization: Bearer {{HOST_TOKEN}}
```

---

## 🎫 PHASE 6: Visitor - Booking & Passes

### 6.1 Get All Places (Public)
```http
GET http://localhost:5000/api/places?city=Chennai&page=1&limit=10
```

### 6.2 Get Place by ID
```http
GET http://localhost:5000/api/places/{{PLACE_ID}}
```

### 6.3 Search Places
```http
GET http://localhost:5000/api/places/search?name=conference&location=Chennai&minPrice=0&maxPrice=1000
```

### 6.4 Create Booking
```http
POST http://localhost:5000/api/passes/request
Authorization: Bearer {{VISITOR_TOKEN}}
Content-Type: application/json

{
  "placeId": "{{PLACE_ID}}",
  "visitDate": "2025-02-02",
  "guests": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "9876543211"
    }
  ]
}
```
**Save as:** `BOOKING_ID` and `PASS_ID`

### 6.5 Get My Passes (Active/Upcoming only)
```http
GET http://localhost:5000/api/passes/my-passes
Authorization: Bearer {{VISITOR_TOKEN}}
```

### 6.6 Get All Bookings (Complete history)
```http
GET http://localhost:5000/api/passes/bookings
Authorization: Bearer {{VISITOR_TOKEN}}
```

**Difference:**
- `getMyPasses`: Returns only ACTIVE/UPCOMING passes (for "My Passes" section)
- `getAllBookingsByVisitor`: Returns ALL bookings including past/cancelled (for "Booking History")

### 6.7 Get Booking Details
```http
GET http://localhost:5000/api/passes/booking/{{BOOKING_ID}}
Authorization: Bearer {{VISITOR_TOKEN}}
```

### 6.8 Confirm Payment
```http
POST http://localhost:5000/api/passes/payments/confirm
Authorization: Bearer {{VISITOR_TOKEN}}
Content-Type: application/json

{
  "bookingId": "{{BOOKING_ID}}"
}
```

### 6.9 Cancel Single Pass
```http
PATCH http://localhost:5000/api/passes/cancel/{{PASS_ID}}
Authorization: Bearer {{VISITOR_TOKEN}}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

### 6.10 Cancel Multiple Passes (Bulk)
```http
PATCH http://localhost:5000/api/passes/cancel-bulk
Authorization: Bearer {{VISITOR_TOKEN}}
Content-Type: application/json

{
  "passIds": ["{{PASS_ID1}}", "{{PASS_ID2}}"],
  "reason": "Event conflict"
}
```

### 6.11 Initiate Refund
```http
POST http://localhost:5000/api/passes/{{BOOKING_ID}}/refund
Authorization: Bearer {{VISITOR_TOKEN}}
Content-Type: application/json

{
  "reason": "Event cancelled by organizer"
}
```

---

## 📊 PHASE 7: Analytics

### 7.1 Get Peak Activity (Admin)
```http
GET http://localhost:5000/api/analytics/admin/peak-activity?period=week
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 7.2 Get Average Visit Duration (Admin)
```http
GET http://localhost:5000/api/analytics/admin/avg-visit-duration
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 7.3 Get Traffic by Place (Admin)
```http
GET http://localhost:5000/api/analytics/admin/traffic-by-place?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

### 7.4 Get Place Visit Stats
```http
GET http://localhost:5000/api/analytics/place/{{PLACE_ID}}/visit-stats
Authorization: Bearer {{HOST_TOKEN}}
```

### 7.5 Get Bookings Per Day (Host)
```http
GET http://localhost:5000/api/host/events/{{PLACE_ID}}/bookings-per-day?startDate=2025-02-01&endDate=2025-02-05
Authorization: Bearer {{HOST_TOKEN}}
```

### 7.6 Get Peak Check-in Hours (Host)
```http
GET http://localhost:5000/api/host/events/{{PLACE_ID}}/peak-checkin-hours
Authorization: Bearer {{HOST_TOKEN}}
```

### 7.7 Get Security Activity (Host)
```http
GET http://localhost:5000/api/host/places/{{PLACE_ID}}/analytics/security-activity
Authorization: Bearer {{HOST_TOKEN}}
```

---

## 🏠 PHASE 8: Public Home Page APIs

### 8.1 Get Home Events (All users)
```http
GET http://localhost:5000/api/public/home-events?city=Chennai&category=conference
```

**Response includes:**
- Featured events
- Upcoming events
- Popular events (by bookings)
- Categories with counts

### 8.2 Get Featured Events Only
```http
GET http://localhost:5000/api/public/featured-events
```

### 8.3 Get Categories
```http
GET http://localhost:5000/api/public/categories
```

---

## 🔄 Complete Testing Sequence

### Sequential Flow:
```
1. SETUP
   ├─ Login Super Admin
   ├─ Register Host
   ├─ Register Visitor
   └─ Create Subscription Plan

2. HOST CREATES EVENT
   ├─ Purchase Subscription (or use free 7-day)
   ├─ Create Place/Event
   ├─ Invite Security
   └─ Verify Place Dashboard

3. VISITOR BOOKS EVENT
   ├─ Browse Public Home Events
   ├─ View Place Details
   ├─ Create Booking
   ├─ Confirm Payment (if paid event)
   ├─ Receive QR codes via email
   └─ Check My Passes

4. SECURITY OPERATIONS
   ├─ Security accepts invite
   ├─ Login as Security
   ├─ View Dashboard
   ├─ Scan visitor pass
   └─ Check activity logs

5. ANALYTICS & REPORTS
   ├─ Admin views peak activity
   ├─ Host checks bookings per day
   ├─ Host views security activity
   └─ Admin monitors traffic

6. MODIFICATIONS
   ├─ Host edits place
   ├─ Host updates capacity
   ├─ Host toggles booking
   └─ Host updates event dates

7. CANCELLATIONS
   ├─ Visitor cancels pass
   ├─ Visitor initiates refund
   ├─ Admin disables user/host
   └─ Admin cancels event

8. HOME PAGE DISPLAY
   ├─ Featured events carousel
   ├─ Upcoming events list
   ├─ Popular events
   └─ Categories filter
```

---

## 🎯 Key Testing Tips

1. **Always save tokens and IDs** from responses
2. **Test in order** - some APIs depend on previous ones
3. **Check emails** - Many operations send email notifications
4. **Verify QR codes** - After payment, passes get QR codes
5. **Test edge cases** - Try booking when capacity full, expired dates, etc.
6. **Test permissions** - Try accessing admin routes as visitor

---

## ⚠️ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Route not found | Wrong endpoint | Check updated router files |
| 403 Forbidden | Wrong role | Use correct token (admin/host/visitor) |
| Subscription required | No active subscription | Purchase subscription first |
| Capacity full | Too many bookings | Increase capacity or choose different date |
| Invalid QR | Wrong format | Use format: `passId\|qrToken` |

---

## 📝 Postman Collection Structure

```
Visitor Pass Management
├── Auth
│   ├── Register User
│   ├── Login User
│   └── Get My Profile
├── Admin
│   ├── Get All Users
│   ├── Get All Passes
│   ├── Invite Admin
│   ├── Disable Admin
│   ├── Disable User
│   ├── Disable Host
│   └── Cancel Event
├── Subscriptions
│   ├── Create Plan
│   ├── Get Plans
│   ├── Get Applicable Plans
│   ├── Toggle Plan
│   └── Purchase Subscription
├── Host - Places
│   ├── Create Place
│   ├── Get My Places
│   ├── Get My Hosted Events
│   ├── Get Place Dashboard
│   ├── Edit Place
│   ├── Update Capacity
│   ├── Toggle Booking
│   ├── Update Event Dates
│   ├── Get Slots
│   └── Manual Override
├── Host - Security
│   ├── Invite Security
│   └── Remove Security
├── Host - Analytics
│   ├── Get Bookings Per Day
│   ├── Get Peak Check-in Hours
│   └── Get Security Activity
├── Security
│   ├── Login as Security
│   ├── Accept Invite
│   ├── Change Password
│   ├── Scan Pass
│   ├── Get Dashboard
│   └── Get Activity
├── Visitor - Booking
│   ├── Get All Places
│   ├── Get Place by ID
│   ├── Search Places
│   ├── Create Booking
│   ├── Get My Passes
│   ├── Get All Bookings
│   ├── Get Booking Details
│   ├── Confirm Payment
│   ├── Cancel Pass
│   ├── Cancel Bulk
│   └── Initiate Refund
├── Analytics
│   ├── Get Peak Activity
│   ├── Get Avg Visit Duration
│   ├── Get Traffic by Place
│   └── Get Place Visit Stats
└── Public
    ├── Get Home Events
    ├── Get Featured Events
    └── Get Categories
```

---

## ✅ Testing Checklist

- [ ] All auth endpoints work
- [ ] Admin can manage users and admins
- [ ] Host can create and manage places
- [ ] Host can invite and manage security
- [ ] Visitor can book and cancel passes
- [ ] Security can scan passes
- [ ] Payment flow works (free and paid)
- [ ] Refund calculation correct
- [ ] Email notifications sent
- [ ] QR codes generated
- [ ] Analytics data accurate
- [ ] Home page shows all events
- [ ] Search and filters work
- [ ] Capacity limits enforced
- [ ] Date validations work
- [ ] Role-based access enforced

---

## 🚀 Ready to Test!

Start with Phase 1 (Authentication) and progress sequentially. Save all tokens and IDs for later use. Happy testing!