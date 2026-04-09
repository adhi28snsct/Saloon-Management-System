# 💇 Salon Booking & Management SaaS (Next.js + Firebase)

A modern **Salon Booking + Customer Management Platform** built with Next.js, Firebase, and shadcn/ui.

This system helps salon owners automate bookings, manage customers, and improve retention — all in one place.

---

## 🚀 Overview

This is not just a dashboard.

It is a **complete business system** that includes:

* 🌐 Public booking page (no login required)
* 🔐 Admin dashboard for management
* 👥 Customer CRM
* 🔔 Follow-up system for retention

Designed to solve real-world problems in service-based businesses.

---

## 🎯 Problems It Solves

Most salons manage operations using:

* WhatsApp chats
* Phone calls
* Notebooks

This leads to:

* Missed or double bookings
* No customer tracking
* Forgotten follow-ups
* Loss of repeat customers

---

## 💡 Solution

This platform provides:

### 🌐 Public Booking System

* Unique booking link (`/salon/[slug]`)
* No login required
* Customers can:

  * View services
  * Select time slots
  * Book instantly

---

### 🔐 Admin Dashboard

* Real-time appointment tracking
* Business analytics
* Manage services and customers

---

### 👩‍🦰 Customer Management (CRM)

* Auto-create customers from bookings
* Track visit history
* Monitor total spending

---

### 🔔 Follow-up System

* Track pending follow-ups
* Highlight “Due Today” actions
* Improve customer retention

---

### 📊 Analytics Dashboard

* Revenue tracking
* Appointment insights
* Booking trends

---

### 📡 Lead Source Tracking

Track where bookings come from:

* Website
* Instagram
* WhatsApp
* Ads

---

## ✨ Features

* 📅 Appointment Management (manual + public bookings)
* 👥 Customer CRM with history tracking
* 🔁 Follow-up system for retention
* 🌐 Public booking page (no login)
* 📊 Business analytics dashboard
* 🔄 Real-time updates (Firebase)

---

## 🛠 Tech Stack

* **Next.js 14+ (App Router)**
* **TypeScript**
* **Firebase (Firestore + Realtime updates)**
* **Tailwind CSS**
* **shadcn/ui**
* **Framer Motion**
* **Lucide Icons**

---

## 🏗 Architecture

```text
Public Booking Page (/salon/[slug])
            ↓
      Firebase Database
            ↓
 Admin Dashboard (real-time updates)
            ↓
 Customer CRM + Follow-ups
            ↓
     Retention Loop 🔁
```

---

## 📦 Project Structure

```
app/
  dashboard/
    appointments/
    customers/
    follow-ups/

  salon/[slug]/   ← Public booking page

components/
  ui/
  dashboard/

lib/
  firebase/
  services/
  appointments/
  customers/

```

---

## ⚙️ Setup

```bash
git clone https://github.com/your-username/salon-dashboard
cd salon
npm install
npm run dev
```

---

## 💼 Customization

This system can be extended with:

* Authentication (role-based access)
* Payment integration
* WhatsApp notifications
* Slot-based booking system
* Multi-business SaaS setup
* Google & Meta integrations

---

## 🎯 Target Users

* Salon owners
* Beauty parlours
* Spas
* Clinics
* Gyms (future expansion)
* Any appointment-based business

---

## 💰 Value Proposition

This system helps businesses:

👉 Automate bookings
👉 Increase repeat customers
👉 Improve revenue
👉 Save time

---

## 🚀 Future Scope

* Slot-based booking system
* WhatsApp automation
* Online payments
* Multi-tenant SaaS scaling
* Mobile app

---

## 📩 Contact

Need a similar system for your business?

Fiverr: https://www.fiverr.com/s/381boxk

Or message me directly
