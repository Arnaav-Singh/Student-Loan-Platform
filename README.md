
# Student Loan Platform 🎓💰

A comprehensive web platform for managing student loans, complaints, room reservations, and customer details. Built with **Node.js** (backend), **MySQL** (database), and designed to be connected to a **React.js** frontend.

## 🌐 Live Demo (Coming Soon)
Stay tuned! A live deployment link will be added once the frontend is fully integrated.

---

## 📂 Repository Structure

```
student-loan-platform/
├── config/            # Database connection & config
├── controllers/       # Request handlers and business logic
├── models/            # MySQL queries and data models
├── routes/            # API endpoints
├── server.js          # Entry point
├── .env               # Environment variables
└── README.md          # You're here!
```

---

## 🧠 Key Features

1. User Registration and Authentication: Secure registration and login for students using
their university credentials.
2. Loan Application: An online form for students to apply for loans, specifying the amount
and purpose.
3. Loan Approval Workflow: Automated and manual processes for reviewing and approving
loan applications.
4. Repayment Tracking: Tools for students to view their repayment schedules and make
payments.
5. Credit Assessment: Evaluation of students' creditworthiness based on their academic
performance and financial history.
6. Notifications and Alerts: Automated notifications for loan status updates, repayment
reminders, and important announcements.
7. AI Chatbot: An AI-powered chatbot to assist students with loan applications,
provide information, and answer common queries.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: React.js (Hosted separately)


---

## 🚀 Getting Started

### Prerequisites

- Node.js
- MySQL
- npm or yarn

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Arnaav-Singh/Student-Loan-Platform.git
   cd Student-Loan-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your `.env` file**
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=student_loans
   ```

4. **Start the server**
   ```bash
   npm start
   ```

---

## 🗂️ Database Tables

- `users`: Platform user credentials
- `customers`: Student/customer records
- `complaints`: Complaint details and statuses
- `room_types`: Room categories and pricing
- `reservations`: Booking records

---

## 📬 API Endpoints (Sample)

- `GET /customers` – Get all customers
- `POST /complaints` – File a new complaint
- `DELETE /reservations/:id` – Cancel a reservation

(Fully documented API collection coming soon!)

---

## 📈 Future Plans

- 🔐 JWT Auth & role-based access
- 📊 Admin dashboard
- 📱 Mobile responsiveness via React
- 🧪 Unit & integration tests
- ☁️ AWS deployment (EC2, RDS)

---

## 🛠️Made By

- [Arnaav Singh](https://github.com/Arnaav-Singh)
- [Manan Sethi](https://github.com/MananSethiii)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

MIT © [Arnaav Singh](https://github.com/Arnaav-Singh)

---

## 📫 Contact

Got questions or ideas? Reach out:

- GitHub: [@Arnaav-Singh](https://github.com/Arnaav-Singh)
- Email: *arnaavsingh5@gmail.com*
