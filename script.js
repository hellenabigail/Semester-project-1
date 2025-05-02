document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Modal functionality
    const loginBtn = document.querySelectorAll('.login-btn');
    const signupBtn = document.querySelectorAll('.signup-btn');
    const bookAppointmentBtn = document.querySelector('.hero-btns .primary-btn');
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const switchToSignup = document.querySelector('.switch-to-signup');
    const switchToLogin = document.querySelector('.switch-to-login');
    
    // Open modal functions
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal function
    function closeModal() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners for opening modals
    loginBtn.forEach(btn => {
        btn.addEventListener('click', () => openModal('login-modal'));
    });
    
    signupBtn.forEach(btn => {
        btn.addEventListener('click', () => openModal('signup-modal'));
    });
    
    if (bookAppointmentBtn) {
        bookAppointmentBtn.addEventListener('click', () => {
            if (isLoggedIn()) {
                openModal('appointment-modal');
            } else {
                openModal('login-modal');
                alert('Please login to book an appointment.');
            }
        });
    }
    
    // Close modals when clicking X button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modals when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // Switch between login and signup modals
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
            openModal('signup-modal');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
            openModal('login-modal');
        });
    }
    
    // Doctor data
    const doctors = [
        {
            id: 1,
            name: "Dr. Sarah Micheals",
            specialty: "Cardiology",
            hospital: "Mulago National Hospital",
            experience: "15 years",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            available: ["Mon", "Wed", "Fri"],
            bio: "Senior cardiologist with extensive experience in heart disease treatment."
        },
        {
            id: 2,
            name: "Dr. James Patel",
            specialty: "Pediatrics",
            hospital: "Nsambya Hospital",
            experience: "12 years",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            available: ["Tue", "Thu", "Sat"],
            bio: "Pediatric specialist focused on child healthcare and development."
        },
        {
            id: 3,
            name: "Dr. Grace Williams",
            specialty: "Neurology",
            hospital: "Case Hospital",
            experience: "18 years",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            available: ["Mon", "Tue", "Wed", "Fri"],
            bio: "Neurology expert with specialization in stroke management."
        },
        {
            id: 4,
            name: "Dr. Alice Akello",
            specialty: "Orthopedics",
            hospital: "Medipal International Hospital",
            experience: "14 years",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            available: ["Wed", "Thu", "Sat"],
            bio: "Orthopedic surgeon specializing in joint replacements."
        },
    ];
    
    // Populate doctors grid
    const doctorsGrid = document.querySelector('.doctors-grid');
    const doctorFilter = document.querySelector('.doctor-filter');
    
    function renderDoctors(filter = 'all') {
        doctorsGrid.innerHTML = '';
        
        const filteredDoctors = filter === 'all' 
            ? doctors 
            : doctors.filter(doctor => doctor.specialty.toLowerCase() === filter);
        
        filteredDoctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <div class="doctor-img">
                    <img src="${doctor.image}" alt="${doctor.name}">
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="specialty">${doctor.specialty}</p>
                    <p class="hospital">${doctor.hospital}</p>
                    <p><i class="fas fa-star"></i> ${doctor.rating} (${doctor.experience} experience)</p>
                    <button class="btn primary-btn book-doctor" data-id="${doctor.id}">Book Appointment</button>
                </div>
            `;
            doctorsGrid.appendChild(doctorCard);
        });
        
        // Add event listeners to book buttons
        document.querySelectorAll('.book-doctor').forEach(btn => {
            btn.addEventListener('click', function() {
                if (isLoggedIn()) {
                    const doctorId = parseInt(this.getAttribute('data-id'));
                    const doctor = doctors.find(d => d.id === doctorId);
                    populateAppointmentForm(doctor);
                    openModal('appointment-modal');
                } else {
                    openModal('login-modal');
                    alert('Please login to book an appointment.');
                }
            });
        });
    }
    
    // Filter doctors
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderDoctors(filter);
        });
    });
    
    // User authentication
    let users = JSON.parse(localStorage.getItem('abbymedics-users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('abbymedics-currentUser')) || null;
    
    // Check if user is logged in
    function isLoggedIn() {
        return currentUser !== null;
    }
    
    // Update UI based on login status
    function updateAuthUI() {
        const loginBtns = document.querySelectorAll('.login-btn, .signup-btn');
        if (isLoggedIn()) {
            loginBtns.forEach(btn => {
                btn.style.display = 'none';
            });
            // Add profile button or other logged-in UI elements
        } else {
            loginBtns.forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('abbymedics-currentUser', JSON.stringify(currentUser));
                alert('Login successful!');
                closeModal();
                updateAuthUI();
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            
            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }
            
            if (users.some(u => u.email === email)) {
                alert('Email already registered. Please login instead.');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name,
                email,
                phone,
                password,
                appointments: []
            };
            
            users.push(newUser);
            localStorage.setItem('abbymedics-users', JSON.stringify(users));
            
            currentUser = newUser;
            localStorage.setItem('abbymedics-currentUser', JSON.stringify(currentUser));
            
            alert('Registration successful! You are now logged in.');
            closeModal();
            updateAuthUI();
        });
    }
    
    // Appointment form
    function populateAppointmentForm(doctor) {
        const doctorSelect = document.getElementById('appointment-doctor');
        doctorSelect.innerHTML = `<option value="${doctor.id}">Dr. ${doctor.name} - ${doctor.specialty}</option>`;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointment-date').min = today;
    }
    
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn()) {
                alert('Please login to book an appointment.');
                openModal('login-modal');
                return;
            }
            
            const doctorId = parseInt(document.getElementById('appointment-doctor').value);
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            const reason = document.getElementById('appointment-reason').value;
            
            const doctor = doctors.find(d => d.id === doctorId);
            
            const appointment = {
                id: Date.now(),
                doctorId,
                doctorName: doctor.name,
                doctorSpecialty: doctor.specialty,
                date,
                time,
                reason,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };
            
            // Add appointment to user
            currentUser.appointments.push(appointment);
            
            // Update users in storage
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('abbymedics-users', JSON.stringify(users));
                localStorage.setItem('abbymedics-currentUser', JSON.stringify(currentUser));
            }
            
            alert(`Appointment booked successfully with Dr. ${doctor.name} on ${date} at ${time}.`);
            closeModal();
        });
    }
    
    // Initialize
    renderDoctors();
    updateAuthUI();
    
    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
        currentTestimonial = index;
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentTestimonial - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            showTestimonial(newIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            let newIndex = currentTestimonial + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showTestimonial(newIndex);
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        let newIndex = currentTestimonial + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    }, 5000);
});