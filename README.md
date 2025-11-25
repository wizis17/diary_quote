# 📚 Flashh Card - Chinese Quote Collection

A modern web application for collecting and exploring Chinese quotes with beautiful UI and powerful features. Built with React, TypeScript, and Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🔥 **Quote Collection** - Add, view, and manage Chinese quotes with translations
- 🖼️ **Image Upload** - Attach images to quotes using Supabase Storage
- 🎯 **Interactive Navigation** - GooeyNav component with fluid animations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast development
- 🔒 **Secure** - Data stored in Supabase with Row Level Security

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation

### Backend
- **Supabase** - Database and storage
  - PostgreSQL database
  - File storage
  - Real-time capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wizis17/flashh-card.git
   cd flashh-card
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase**
   
   Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
   - Create a Supabase project
   - Set up the database table
   - Configure storage bucket

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.


## 🎨 Features in Detail

### GooeyNav Component
Interactive navigation with fluid animations and particle effects. Supports both route navigation and smooth scrolling to page sections.

### Collection Preview
Home page displays first 4 quotes in a responsive grid, with special layout for the first card showing text and image side-by-side.

### Image Upload
Direct file upload to Supabase Storage with progress tracking and automatic URL generation.

### Responsive Design
Mobile-first design that adapts to all screen sizes with Tailwind CSS breakpoints.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**wizis17**
- GitHub: [@wizis17](https://github.com/wizis17)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Hosting platform
- [shadcn/ui](https://ui.shadcn.com) - UI components inspiration
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by wizis17
