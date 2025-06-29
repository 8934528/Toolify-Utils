# 🛠️ Toolify-Utils  

**Your All-in-One Web Utility App**  

![Demo](assets/demo.gif)  

## 🔥 Features  
✔ **Calculator** – Basic arithmetic operations  
✔ **Temperature Converter** – Switch between °C, °F, and K  
✔ **To-Do List** – Add, delete, and manage tasks  

## � Tech Stack  
- **Frontend**: HTML5, CSS3, JavaScript  
- **Styling**: Bootstrap 5 + Custom CSS  
- **Icons**: FlatIcon  
- **Animations**: Animate.css  

## 🎨 Unique Design Choices  
- **Color Scheme**: Teal, Coral, Mustard (No overused blues/purples)  
- **Smooth Transitions**: Hover effects & entrance animations  
- **Mobile-First**: Fully responsive  

## 🚀 How to Run  
1. Clone the repo:  
   ```bash
   git clone https://github.com/8934528/Toolify-Utils.git

   # **Toolify-Utils: Multi-Tool Web App**  

Here’s a complete, responsive, and animated **index.html**, **index.css**, and **index.js** for your **Toolify-Utils** project. It includes:  
✔ **Bootstrap 5** for responsiveness  
✔ **Animate.css** for smooth animations  
✔ **FlatIcon** icons for a modern look  
✔ **Unique color scheme** (avoiding overused colors)  
✔ **README.md** template (unique & professional)  

---

## **1. Folder Structure**  
```
📂 Toolify-Utils/  
├── index.html  
├── css/  
│   └── index.css  
├── js/  
│   └── index.js  
├── assets/  
│   └── (icons, images, etc.)  
└── README.md  
```

---

## **2. `index.html`**  
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toolify-Utils | Your Multi-Tool Web App</title>
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <!-- FlatIcon -->
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.1.0/uicons-regular-rounded/css/uicons-regular-rounded.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/index.css">
</head>
<body>
    <div class="container-fluid main-container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-8 text-center animate__animated animate__fadeIn">
                <h1 class="display-4 fw-bold mb-4">Welcome to <span class="brand">Toolify-Utils</span></h1>
                <p class="lead mb-5">Your all-in-one web app for quick calculations, temperature conversions, and task management!</p>
                
                <!-- Tool Cards -->
                <div class="row g-4">
                    <!-- Calculator -->
                    <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
                        <div class="card tool-card">
                            <div class="card-body">
                                <i class="fi fi-rr-calculator icon"></i>
                                <h3 class="card-title">Calculator</h3>
                                <p class="card-text">Perform quick math calculations with ease.</p>
                                <a href="calculator.html" class="btn btn-toolify">Open Calculator</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Temp Converter -->
                    <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                        <div class="card tool-card">
                            <div class="card-body">
                                <i class="fi fi-rr-temperature-high icon"></i>
                                <h3 class="card-title">Temp Converter</h3>
                                <p class="card-text">Convert between Celsius, Fahrenheit & Kelvin.</p>
                                <a href="converter.html" class="btn btn-toolify">Open Converter</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- To-Do List -->
                    <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-3s">
                        <div class="card tool-card">
                            <div class="card-body">
                                <i class="fi fi-rr-tasks icon"></i>
                                <h3 class="card-title">To-Do List</h3>
                                <p class="card-text">Organize your tasks efficiently.</p>
                                <a href="todo.html" class="btn btn-toolify">Open To-Do</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="js/index.js"></script>
</body>
</html>
```

---

## **3. `index.css` (Unique Color Scheme: Teal, Coral, Mustard)**  
```css
:root {
    --primary: #2a9d8f;  /* Teal */
    --secondary: #e76f51; /* Coral */
    --accent: #e9c46a;   /* Mustard */
    --dark: #264653;     /* Dark Slate */
    --light: #f8f9fa;    /* Light Gray */
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--light);
}

.main-container {
    background-color: var(--light);
    padding: 20px;
}

.brand {
    color: var(--primary);
    font-weight: 700;
}

.tool-card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    background: white;
}

.tool-card:hover {
    transform: translateY(-10px);
}

.icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--primary);
}

.btn-toolify {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.btn-toolify:hover {
    background-color: var(--secondary);
    transform: scale(1.05);
}
```

---

## **4. `index.js` (Optional Animations & Transitions)**  
```javascript
// Smooth hover effects
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    });
});
```

---

## **5. `README.md` (Unique & Professional)**  
```markdown
# 🛠️ Toolify-Utils  

**Your All-in-One Web Utility App**  

![Demo](assets/demo.gif)  

## 🔥 Features  
✔ **Calculator** – Basic arithmetic operations  
✔ **Temperature Converter** – Switch between °C, °F, and K  
✔ **To-Do List** – Add, delete, and manage tasks  

## � Tech Stack  
- **Frontend**: HTML5, CSS3, JavaScript  
- **Styling**: Bootstrap 5 + Custom CSS  
- **Icons**: FlatIcon  
- **Animations**: Animate.css  

## 🎨 Unique Design Choices  
- **Color Scheme**: Teal, Coral, Mustard (No overused blues/purples)  
- **Smooth Transitions**: Hover effects & entrance animations  
- **Mobile-First**: Fully responsive  

## 🚀 How to Run  
1. Clone the repo:  
   ```bash
   git clone https://github.com/yourusername/Toolify-Utils.git
   ```
2. Open `index.html` in a browser.  

## 📜 License  
MIT © [Your Name]  
```

---

### **Final Notes**  
✅ **Unique colors** (Teal, Coral, Mustard)  
✅ **Animations & transitions** (Animate.css + hover effects)  
✅ **Professional README.md**  
✅ **Fully responsive (Bootstrap 5)**  

Would you like any modifications (e.g., different animations, additional tools)? 🚀
