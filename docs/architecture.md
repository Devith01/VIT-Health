# VIT-Health System Architecture

## Overview
VIT-Health is an AI-powered smart campus healthcare, disease surveillance, and emergency response system proposed for VTOP integration at VIT Bhopal.

## Core Microservices Architecture
1. **Frontend Service**: React + TypeScript + Vite + Tailwind CSS + TanStack Query
2. **Backend Gateway & API Service**: Express + TypeScript + Prisma ORM + Socket.IO
3. **AI/ML Health Intelligence Engine**: Python + FastAPI + Scikit-learn + XGBoost + Pandas
4. **Data Layer**: PostgreSQL 16 + Prisma Client

## Communication Flow
- **HTTP / REST**: Frontend ↔ Backend ↔ AI Service
- **WebSockets**: Socket.IO for real-time ambulance tracking & outbreak notification alerts
- **Database Access**: Backend service exclusively interacts with PostgreSQL via Prisma ORM
