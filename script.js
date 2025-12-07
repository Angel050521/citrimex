// ===== NAVIGATION MENU =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// Toggle menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== HERO PARALLAX =====
document.addEventListener('mousemove', (e) => {
    const lemon = document.querySelector('.hero__lemon');
    if (lemon) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        lemon.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
});

// ===== MODALS =====
const valueCards = document.querySelectorAll('.value-card');
const recipeCards = document.querySelectorAll('.recipe-card[data-recipe]');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal__close');

// Open modal for value cards
valueCards.forEach(card => {
    card.addEventListener('click', () => {
        const modalId = 'modal-' + card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Open modal for recipe cards
recipeCards.forEach(card => {
    card.addEventListener('click', () => {
        const recipeId = card.getAttribute('data-recipe');
        const modal = document.getElementById('modal-recipe-' + recipeId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalCloses.forEach(close => {
    close.addEventListener('click', () => {
        close.closest('.modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements (excluding recipe-card to prevent layout issues)
const animateElements = document.querySelectorAll('.value-card, .products__info, .packaging__list, .contact__block, .market__region, .benefit-card, .tip-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    observer.observe(el);
});

// Separate animation for recipe cards with fade only (no transform to prevent layout shift)
const recipeCardElements = document.querySelectorAll('.recipe-card');
recipeCardElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ===== IMAGE LIGHTBOX =====
const recipeImages = document.querySelectorAll('.recipe-card__image img, .products__gallery img');

recipeImages.forEach(img => {
    img.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox__content">
                <span class="lightbox__close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Trigger reflow
        lightbox.offsetHeight;
        lightbox.style.opacity = '1';

        const close = lightbox.querySelector('.lightbox__close');
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        };

        close.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    });
});

// Add lightbox styles dynamically
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 28, 21, 0.95);
        backdrop-filter: blur(5px);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox__content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .lightbox[style*="opacity: 1"] .lightbox__content {
        transform: scale(1);
    }
    
    .lightbox__content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    
    .lightbox__close {
        position: absolute;
        top: -50px;
        right: 0;
        font-size: 2.5rem;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.8;
    }
    
    .lightbox__close:hover {
        color: #72ef36;
        opacity: 1;
        transform: rotate(90deg);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// ===== LANGUAGE SWITCHER =====
const translations = {
    es: {
        nav: {
            inicio: "Inicio",
            quienes: "Quiénes Somos",
            organigrama: "Organigrama",
            productos: "Productos",
            recetas: "Recetas",
            mercado: "Mercado",
            contacto: "Contacto"
        },
        hero: {
            title: "De México para el mundo",
            description: "Más de 40 años de experiencia en la industria sembrando, empacando y comercializando cítricos durante todo el año."
        },
        about: {
            title: "Quiénes somos",
            text1: "Grupo Citrimex, S.A. de C.V. es una empresa michoacana dedicada desde hace más de 40 años al empaque y comercialización de cítricos con infraestructura propia.",
            text2: "La compañía tiene su sede en Apatzingán, Michoacán, región clave del limón mexicano, y ofrece principalmente limón persa (mexicano) fresco, aunque también trabaja con naranja, toronja, mango y aguacate."
        },
        values: {
            mision: "Misión",
            vision: "Visión",
            valores: "Valores",
            valoresTitle: "Nuestros Valores"
        },
        valoresCards: {
            calidad: "Calidad",
            confianza: "Confianza",
            equipo: "Trabajo en equipo",
            pasion: "Pasión",
            consumidor: "Enfoque al consumidor",
            eficiencia: "Eficiencia"
        },
        orgchart: {
            title: "Organigrama",
            intro: "Conoce nuestra estructura organizacional"
        },
        products: {
            title: "Productos",
            subtitle: "LIMÓN FRESCO Y JUGOSO",
            name: "LIMÓN CITRUS AURANTIFOLIA",
            calibre: "CALIBRE",
            peso: "Peso",
            weight1: "De 60 a 80 grs",
            weight2: "De 40 a 60 grs",
            weight3: "De 20 a 40 grs",
            description: "En Grupo Citrimex ofrecemos servicios de producción, empaque, comercialización principalmente de Limón Mexicano pero también de otros productos de nuestras líneas de negocios como limón persa, naranja, toronja, mango y aguacate."
        },
        grapefruit: {
            subtitle: "TORONJA FRESCA Y NUTRITIVA",
            name: "TORONJA CITRUS PARADISI",
            weight1: "De 400 a 450 grs",
            weight2: "De 350 a 400 grs",
            weight3: "De 300 a 350 grs",
            description: "La toronja que ofrecemos es de la más alta calidad, cultivada en las mejores tierras de México. Rica en vitamina C y antioxidantes, nuestra toronja es perfecta para el consumo fresco y jugos naturales. Empacada en cajas de 20 kilos para garantizar su frescura."
        },
        avocado: {
            subtitle: "AGUACATE HASS DE CALIDAD PREMIUM",
            name: "AGUACATE HASS",
            weight1: "De 280 a 315 grs",
            weight2: "De 250 a 280 grs",
            weight3: "De 220 a 250 grs",
            description: "Nuestro aguacate Hass es reconocido mundialmente por su calidad excepcional. Cultivado en Michoacán, el corazón aguacatero de México, ofrecemos aguacates con la textura cremosa y el sabor único que caracteriza a esta variedad. Disponible en cajas de 10 y 20 kilos."
        },
        mango: {
            subtitle: "MANGO FRESCO Y DELICIOSO",
            name: "MANGO ATAULFO Y KENT",
            variedad: "VARIEDAD",
            weight1: "De 200 a 300 grs",
            weight2: "De 400 a 600 grs",
            weight3: "De 300 a 500 grs",
            description: "Nuestro mango mexicano es reconocido por su sabor dulce y textura jugosa. Cultivado en las mejores regiones de México, ofrecemos variedades premium como Ataulfo, Kent y Tommy. El mango es una fruta tropical de temporada que ofrece un sabor único y auténtico. Disponible en cajas de 10 kilos."
        },
        seasonal: {
            badge: "🍊 Por Temporada"
        },
        packaging: {
            title: "Empaque",
            intro: "Empacamos nuestra fruta en diferentes presentaciones como:",
            item1: "Arpilla de 17 kilos",
            item2: "Malla de medio kilo, kilo y medio y 2 kilos, con o sin etiqueta",
            item3: "Aguacate en caja de 10 y 20 kilos",
            item4: "Toronja en caja de 20 kilos",
            item5: "Limón persa en caja de cartón y plástico de 18 kilos"
        },
        benefits: {
            title: "Beneficios del Limón",
            intro: "El limón es una fruta de alto consumo en nuestra gastronomía aportando propiedades y nutrientes que mejoran nuestro organismo."
        },
        tips: {
            tip1: "Para escoger un limón con gran cantidad de zumo, elige el que tenga la piel más delgada y mayor peso con respecto a su tamaño.",
            tip2: "Para exprimir mejor su jugo, haz rodar el limón con un poco de presión para ablandar su piel."
        },
        fact: {
            title: "¿Sabías que...?",
            text: "El limón era utilizado por la marina inglesa en el siglo 18 para prevenir enfermedades de los marinos y que aguantaran más tiempo en el mar."
        },
        benefitCards: {
            vitaminc: {
                title: "Rico en Vitamina C",
                desc: "Fortalece el sistema inmunológico y ayuda a prevenir resfriados."
            },
            hydration: {
                title: "Hidratación",
                desc: "Excelente para mantenerte hidratado y refrescado durante el día."
            },
            digestive: {
                title: "Salud Digestiva",
                desc: "Ayuda al proceso digestivo liberando al hígado de sustancias nocivas."
            },
            antioxidant: {
                title: "Antioxidante",
                desc: "Combate los radicales libres y promueve una piel saludable."
            }
        },
        grapefruitBenefits: {
            title: "Beneficios de la Toronja",
            intro: "La toronja es una fruta cítrica rica en nutrientes que aporta múltiples beneficios para tu salud."
        },
        grapefruitBenefitCards: {
            vitaminc: {
                title: "Alta en Vitamina C",
                desc: "Una toronja proporciona más del 100% de la ingesta diaria recomendada de vitamina C."
            },
            weightloss: {
                title: "Control de Peso",
                desc: "Ayuda en la pérdida de peso al mejorar el metabolismo y reducir el apetito."
            },
            heart: {
                title: "Salud Cardiovascular",
                desc: "Reduce el colesterol y mejora la salud del corazón gracias a sus antioxidantes."
            },
            skin: {
                title: "Piel Saludable",
                desc: "Rico en antioxidantes que protegen la piel del envejecimiento prematuro."
            }
        },
        avocadoBenefits: {
            title: "Beneficios del Aguacate",
            intro: "El aguacate es un superalimento rico en grasas saludables y nutrientes esenciales."
        },
        avocadoBenefitCards: {
            healthyfats: {
                title: "Grasas Saludables",
                desc: "Rico en ácidos grasos monoinsaturados que benefician la salud del corazón."
            },
            fiber: {
                title: "Alto en Fibra",
                desc: "Mejora la digestión y ayuda a mantener niveles saludables de azúcar en sangre."
            },
            potassium: {
                title: "Rico en Potasio",
                desc: "Contiene más potasio que el plátano, esencial para la presión arterial."
            },
            nutrients: {
                title: "Absorción de Nutrientes",
                desc: "Ayuda a absorber vitaminas liposolubles de otros alimentos."
            }
        },
        mangoBenefits: {
            title: "Beneficios del Mango",
            intro: "El mango es una fruta tropical deliciosa que aporta numerosos beneficios para la salud."
        },
        mangoBenefitCards: {
            vitamins: {
                title: "Rico en Vitaminas",
                desc: "Excelente fuente de vitaminas A, C y E que fortalecen el organismo."
            },
            digestion: {
                title: "Mejora la Digestión",
                desc: "Contiene enzimas digestivas que ayudan a descomponer los alimentos."
            },
            immune: {
                title: "Sistema Inmunológico",
                desc: "Fortalece las defensas del cuerpo gracias a su alto contenido de vitamina C."
            },
            skin: {
                title: "Piel Saludable",
                desc: "Los antioxidantes del mango ayudan a mantener una piel radiante y joven."
            }
        },
        recipes: {
            title: "Recetas con Limón",
            intro: "Descubre deliciosas formas de incorporar el limón mexicano en tu cocina"
        },
        recipeCards: {
            ceviche: {
                tag: "Mariscos",
                title: "Ceviche Mexicano",
                desc: "Pescado fresco marinado en jugo de limón con cebolla, cilantro y chile.",
                time: "30 min",
                servings: "4 porciones"
            },
            limonada: {
                tag: "Bebidas",
                title: "Limonada Natural",
                desc: "Refrescante bebida con limón recién exprimido, agua y un toque de menta.",
                time: "10 min",
                servings: "6 porciones"
            },
            guacamole: {
                tag: "Salsas",
                title: "Guacamole Perfecto",
                desc: "Aguacate cremoso con limón, tomate, cebolla y cilantro fresco.",
                time: "15 min",
                servings: "4 porciones"
            },
            tacos: {
                tag: "Platillos",
                title: "Tacos al Pastor",
                desc: "Deliciosos tacos con un toque de limón que realza todos los sabores.",
                time: "45 min",
                servings: "6 porciones"
            },
            pay: {
                tag: "Postres",
                title: "Pay de Limón",
                desc: "Postre cremoso con base de galleta y relleno de limón mexicano.",
                time: "60 min",
                servings: "8 porciones"
            },
            pollo: {
                tag: "Carnes",
                title: "Pollo al Limón",
                desc: "Pechuga de pollo marinada en limón con hierbas aromáticas.",
                time: "40 min",
                servings: "4 porciones"
            }
        },
        grapefruitRecipes: {
            title: "Recetas con Toronja",
            intro: "Descubre deliciosas formas de incorporar la toronja en tu cocina"
        },
        grapefruitRecipeCards: {
            ensalada: {
                tag: "Ensaladas",
                title: "Ensalada de Toronja y Aguacate",
                desc: "Refrescante combinación de toronja, aguacate y verduras frescas.",
                time: "20 min",
                servings: "4 porciones"
            },
            agua: {
                tag: "Bebidas",
                title: "Agua de Toronja Natural",
                desc: "Bebida refrescante y nutritiva perfecta para el verano.",
                time: "15 min",
                servings: "6 porciones"
            },
            salmon: {
                tag: "Pescados",
                title: "Salmón Glaseado con Toronja",
                desc: "Salmón con un delicioso glaseado cítrico de toronja.",
                time: "35 min",
                servings: "4 porciones"
            }
        },
        avocadoRecipes: {
            title: "Recetas con Aguacate",
            intro: "Deliciosas recetas aprovechando el aguacate Hass premium"
        },
        avocadoRecipeCards: {
            toast: {
                tag: "Desayunos",
                title: "Tostadas de Aguacate",
                desc: "Delicioso desayuno saludable con aguacate cremoso.",
                time: "10 min",
                servings: "2 porciones"
            },
            ensalada: {
                tag: "Ensaladas",
                title: "Ensalada Fresca con Aguacate",
                desc: "Ensalada nutritiva con aguacate, pollo y vinagreta.",
                time: "25 min",
                servings: "4 porciones"
            },
            smoothie: {
                tag: "Bebidas",
                title: "Smoothie Verde de Aguacate",
                desc: "Batido cremoso y energizante con aguacate y espinacas.",
                time: "5 min",
                servings: "2 porciones"
            }
        },
        mangoRecipes: {
            title: "Recetas con Mango",
            intro: "Explora el sabor tropical del mango mexicano"
        },
        mangoRecipeCards: {
            salsa: {
                tag: "Salsas",
                title: "Salsa de Mango Picante",
                desc: "Salsa tropical perfecta para tacos y pescados.",
                time: "15 min",
                servings: "4 porciones"
            },
            agua: {
                tag: "Bebidas",
                title: "Agua Fresca de Mango",
                desc: "Refrescante bebida natural con mango dulce.",
                time: "10 min",
                servings: "6 porciones"
            },
            postre: {
                tag: "Postres",
                title: "Mousse de Mango",
                desc: "Postre ligero y cremoso con mango natural.",
                time: "30 min",
                servings: "6 porciones"
            }
        },
        clients: {
            title: "Nuestros Clientes",
            intro: "Empresas que confían en la calidad de nuestros productos"
        },
        market: {
            title: "MERCADO",
            intro: "Nuestra cobertura de entrega abarca ubicaciones estratégicas en diversas zonas.",
            internacional: "INTERNACIONAL:",
            nacional: "NACIONAL:"
        },
        contact: {
            title: "CONTACTO",
            internacional: "Internacional",
            nacional: "Nacional",
            whatsapp: "WhatsApp",
            direccion: "Dirección"
        },
        footer: {
            rights: "© 2024 CITRIMEX. Todos los derechos reservados.",
            slogan: "De México para el mundo"
        },
        modals: {
            mision: {
                title: "Misión",
                text: "Somos una empresa líder en la industria que produce, empaca y comercializa Limón Mexicano, brindando a nuestros clientes un producto fresco, jugoso, de alta calidad con precios competitivos.",
                highlight: "Producto fresco y de alta calidad"
            },
            vision: {
                title: "Visión",
                text: "Ser una empresa líder en el mercado global con productos de calidad, resultado del compromiso, innovación constante, trabajo en equipo y crecimiento sustentable, preparándonos para las más altas exigencias.",
                highlight: "Más de 40 años de experiencia"
            },
            valores: {
                title: "Valores",
                intro: "Valores institucionales basados en el análisis de nuestras operaciones, trayectoria y cultura organizacional:"
            },
            valoresInd: {
                calidad: {
                    title: "Calidad",
                    text: "Implica ofrecer productos que cumplan con los estándares más altos de frescura, higiene, sabor y presentación. En Grupo Citrimex, significa cuidar cada etapa: desde la selección del limón y otros cítricos hasta su empaque y entrega, garantizando que el cliente reciba un producto impecable."
                },
                confianza: {
                    title: "Confianza",
                    text: "Es la seguridad que la empresa transmite a clientes, colaboradores y socios. En Citrimex se refleja mediante la transparencia en procesos, cumplimiento de acuerdos, puntualidad en entregas y un manejo responsable de la producción, generando relaciones sólidas y de largo plazo."
                },
                equipo: {
                    title: "Trabajo en equipo",
                    text: "Se refiere a la colaboración armónica entre todas las áreas: campo, selección, empaque, logística, ventas y administración. El objetivo es unir esfuerzos y habilidades para cumplir la misión de la empresa y mantener un flujo eficiente de productos de alta calidad."
                },
                pasion: {
                    title: "Pasión",
                    text: "Es el compromiso y energía con la que cada colaborador realiza su labor. En Citrimex, la pasión se traduce en orgullo por el producto mexicano, dedicación diaria y una actitud positiva para superar desafíos, buscando siempre ser mejores."
                },
                consumidor: {
                    title: "Enfoque al consumidor",
                    text: "Significa comprender las necesidades de los clientes nacionales e internacionales, anticiparse a sus expectativas y ofrecer productos que satisfagan sus estándares. Esto incluye frescura, presentación, precio competitivo y un servicio confiable y personalizado."
                },
                eficiencia: {
                    title: "Eficiencia",
                    text: "Es la capacidad de realizar los procesos con el menor desperdicio posible de tiempo, recursos y esfuerzo. En Grupo Citrimex implica optimizar líneas de empaque, logística, uso de infraestructura, tecnología y mano de obra para lograr altos volúmenes de producción con costos controlados."
                }
            }
        },
        recipeModals: {
            common: {
                ingredientsTitle: "Ingredientes",
                preparationTitle: "Preparación",
                difficulty: "Fácil"
            },
            ceviche: {
                difficulty: "Fácil",
                ingredients: [
                    "500g de pescado blanco fresco \"tilapia o robalo\"",
                    "1 taza de jugo de limón mexicano \"aprox. 10-12 limones\"",
                    "1 cebolla morada picada finamente",
                    "2 tomates picados en cubos",
                    "1/2 taza de cilantro fresco picado",
                    "2 chiles serranos picados \"opcional\"",
                    "1 pepino picado en cubos",
                    "Sal y pimienta al gusto",
                    "Aguacate para servir",
                    "Tostadas o galletas saladas"
                ],
                steps: [
                    "Corta el pescado en cubos pequeños de aproximadamente 1 cm y colócalos en un recipiente de vidrio.",
                    "Vierte el jugo de limón sobre el pescado, asegurándote de que quede completamente cubierto. Refrigera por 20-30 minutos.",
                    "Mientras el pescado se \"cocina\" en el limón, prepara todos los vegetales: pica la cebolla, tomate, cilantro, chile y pepino.",
                    "Una vez que el pescado esté opaco \"señal de que está listo\", escurre el exceso de jugo de limón.",
                    "Mezcla el pescado con la cebolla, tomate, cilantro, chile y pepino.",
                    "Sazona con sal y pimienta al gusto. Puedes agregar un poco más de jugo de limón fresco.",
                    "Sirve inmediatamente con aguacate en rodajas y tostadas. ¡Disfruta!"
                ],
                tip: "Usa limón mexicano recién exprimido para obtener el mejor sabor. El limón debe estar a temperatura ambiente para extraer más jugo."
            },
            limonada: {
                difficulty: "Muy fácil",
                ingredients: [
                    "1 taza de jugo de limón mexicano \"8-10 limones\"",
                    "1 litro de agua fría",
                    "3/4 taza de azúcar \"ajustar al gusto\"",
                    "Hojas de menta fresca \"opcional\"",
                    "Hielo al gusto",
                    "Rodajas de limón para decorar"
                ],
                steps: [
                    "Exprime los limones y cuela el jugo para eliminar las semillas.",
                    "En una jarra grande, disuelve el azúcar en una taza de agua tibia.",
                    "Agrega el jugo de limón y el resto del agua fría. Mezcla bien.",
                    "Prueba y ajusta el dulzor según tu preferencia.",
                    "Agrega las hojas de menta si lo deseas y refrigera por 15 minutos.",
                    "Sirve con abundante hielo y decora con rodajas de limón."
                ],
                tip: "Para una limonada más refrescante, congela cubos de limonada y úsalos en lugar de hielo regular. ¡Así no se aguará tu bebida!"
            },
            guacamole: {
                difficulty: "Fácil",
                ingredients: [
                    "3 aguacates maduros",
                    "Jugo de 2 limones mexicanos",
                    "1/2 cebolla blanca picada finamente",
                    "1 tomate picado en cubos pequeños",
                    "1/4 taza de cilantro fresco picado",
                    "1-2 chiles serranos picados (al gusto)",
                    "Sal al gusto",
                    "Totopos para acompañar"
                ],
                steps: [
                    "Corta los aguacates por la mitad, retira el hueso y extrae la pulpa con una cuchara.",
                    "En un molcajete o tazón, machaca el aguacate con un tenedor hasta obtener la textura deseada.",
                    "Agrega inmediatamente el jugo de limón y mezcla bien \"esto evita que se oxide\".",
                    "Incorpora la cebolla, tomate, cilantro y chile. Mezcla suavemente.",
                    "Sazona con sal al gusto y ajusta el limón si es necesario.",
                    "Sirve inmediatamente con totopos crujientes. ¡Buen provecho!"
                ],
                tip: "El limón es clave para que el guacamole no se oxide. Agrega suficiente jugo y cubre con plástico directamente sobre la superficie si vas a guardarlo."
            },
            tacos: {
                difficulty: "Intermedio",
                ingredients: [
                    "1 kg de carne de cerdo en filetes delgados",
                    "4 chiles guajillo \"sin semillas\"",
                    "2 chiles ancho \"sin semillas\"",
                    "1/2 taza de jugo de limón mexicano",
                    "1/4 de piña en cubos",
                    "1/2 cebolla + más para servir",
                    "3 dientes de ajo",
                    "1 cdta de comino, orégano y achiote",
                    "Tortillas de maíz",
                    "Cilantro, cebolla y limones para servir"
                ],
                steps: [
                    "Hidrata los chiles en agua caliente por 15 minutos. Licúalos con ajo, cebolla, especias y jugo de limón.",
                    "Marina la carne con el adobo por al menos 2 horas \"mejor toda la noche\".",
                    "Cocina la carne en un sartén caliente o parrilla hasta que esté dorada y cocida.",
                    "Pica la carne en trozos pequeños. Dora los cubos de piña en el mismo sartén.",
                    "Calienta las tortillas y arma los tacos con la carne y piña.",
                    "Sirve con cebolla picada, cilantro y un generoso chorrito de limón fresco."
                ],
                tip: "El limón al final es esencial. Exprime limón fresco sobre cada taco justo antes de comer para realzar todos los sabores."
            },
            pay: {
                difficulty: "Intermedio",
                ingredients: [
                    "Base: 2 tazas de galletas María molidas + 100g mantequilla derretida",
                    "Relleno: 1 lata de leche condensada \"397g\"",
                    "1 lata de leche evaporada \"360ml\"",
                    "1 taza de jugo de limón mexicano \"10-12 limones\"",
                    "Ralladura de 2 limones",
                    "4 yemas de huevo",
                    "Merengue: 4 claras de huevo + 1/2 taza de azúcar"
                ],
                steps: [
                    "Mezcla las galletas molidas con la mantequilla. Presiona en un molde para pay y hornea 10 min a 180°C.",
                    "Licúa la leche condensada, evaporada, yemas, jugo y ralladura de limón hasta integrar.",
                    "Vierte el relleno sobre la base y hornea 20 minutos a 180°C hasta que cuaje.",
                    "Para el merengue: bate las claras a punto de nieve, agrega el azúcar gradualmente.",
                    "Cubre el pay con el merengue y hornea 5-10 minutos hasta dorar.",
                    "Refrigera por al menos 4 horas antes de servir. ¡Delicioso!"
                ],
                tip: "Usa limones a temperatura ambiente y ruédalos antes de exprimirlos para obtener más jugo. La ralladura aporta un aroma increíble."
            },
            pollo: {
                difficulty: "Fácil",
                ingredients: [
                    "4 pechugas de pollo",
                    "1/2 taza de jugo de limón mexicano",
                    "Ralladura de 2 limones",
                    "4 dientes de ajo picados",
                    "2 cdas de aceite de oliva",
                    "1 cdta de orégano seco",
                    "1 cdta de tomillo",
                    "Sal y pimienta al gusto",
                    "Perejil fresco para decorar"
                ],
                steps: [
                    "Mezcla el jugo de limón, ralladura, ajo, aceite, orégano, tomillo, sal y pimienta.",
                    "Marina las pechugas en esta mezcla por al menos 30 minutos \"mejor 2 horas\".",
                    "Calienta un sartén a fuego medio-alto con un poco de aceite.",
                    "Cocina las pechugas 6-7 minutos por lado hasta que estén doradas y cocidas.",
                    "Vierte el resto de la marinada en el sartén y cocina 2 minutos más.",
                    "Sirve con el jugo de la cocción, decora con perejil y rodajas de limón."
                ],
                tip: "No marines el pollo más de 4 horas, ya que el ácido del limón puede cambiar la textura de la carne. El tiempo ideal es 30 min a 2 horas."
            }
        }
    },
    en: {
        nav: {
            inicio: "Home",
            quienes: "About Us",
            organigrama: "Organization",
            productos: "Products",
            recetas: "Recipes",
            mercado: "Market",
            contacto: "Contact"
        },
        hero: {
            title: "From Mexico to the World",
            description: "More than 40 years of experience in the industry growing, packing and commercializing citrus fruits throughout the year."
        },
        about: {
            title: "About Us",
            text1: "Grupo Citrimex, S.A. de C.V. is a Michoacan company dedicated for more than 40 years to the packaging and commercialization of citrus fruits with its own infrastructure.",
            text2: "The company is headquartered in Apatzingán, Michoacán, a key region for Mexican lemon, and mainly offers fresh Persian (Mexican) lemon, although it also works with orange, grapefruit, mango and avocado."
        },
        values: {
            mision: "Mission",
            vision: "Vision",
            valores: "Values",
            valoresTitle: "Our Values"
        },
        valoresCards: {
            calidad: "Quality",
            confianza: "Trust",
            equipo: "Teamwork",
            pasion: "Passion",
            consumidor: "Customer Focus",
            eficiencia: "Efficiency"
        },
        orgchart: {
            title: "Organization Chart",
            intro: "Meet our organizational structure"
        },
        products: {
            title: "Products",
            subtitle: "FRESH AND JUICY LEMON",
            name: "CITRUS AURANTIFOLIA LEMON",
            calibre: "CALIBER",
            peso: "Weight",
            weight1: "From 60 to 80 grams",
            weight2: "From 40 to 60 grams",
            weight3: "From 20 to 40 grams",
            description: "At Grupo Citrimex we offer production, packaging, and commercialization services mainly of Mexican Lime but also of other products from our business lines such as Persian lime, orange, grapefruit, mango and avocado."
        },
        grapefruit: {
            subtitle: "FRESH AND NUTRITIOUS GRAPEFRUIT",
            name: "GRAPEFRUIT CITRUS PARADISI",
            weight1: "From 400 to 450 grams",
            weight2: "From 350 to 400 grams",
            weight3: "From 300 to 350 grams",
            description: "The grapefruit we offer is of the highest quality, grown in the best lands of Mexico. Rich in vitamin C and antioxidants, our grapefruit is perfect for fresh consumption and natural juices. Packed in 20-kilo boxes to guarantee its freshness."
        },
        avocado: {
            subtitle: "PREMIUM QUALITY HASS AVOCADO",
            name: "HASS AVOCADO",
            weight1: "From 280 to 315 grams",
            weight2: "From 250 to 280 grams",
            weight3: "From 220 to 250 grams",
            description: "Our Hass avocado is recognized worldwide for its exceptional quality. Grown in Michoacán, the avocado heart of Mexico, we offer avocados with the creamy texture and unique flavor that characterizes this variety. Available in 10 and 20 kilo boxes."
        },
        mango: {
            subtitle: "FRESH AND DELICIOUS MANGO",
            name: "ATAULFO AND KENT MANGO",
            variedad: "VARIETY",
            weight1: "From 200 to 300 grams",
            weight2: "From 400 to 600 grams",
            weight3: "From 300 to 500 grams",
            description: "Our Mexican mango is recognized for its sweet taste and juicy texture. Grown in the best regions of Mexico, we offer premium varieties such as Ataulfo, Kent and Tommy. Mango is a seasonal tropical fruit that offers a unique and authentic flavor. Available in 10 kilo boxes."
        },
        seasonal: {
            badge: "🍊 Seasonal"
        },
        packaging: {
            title: "Packaging",
            intro: "We package our fruit in different presentations such as:",
            item1: "17 kilo burlap sack",
            item2: "Half kilo, kilo and a half and 2 kilo mesh, with or without label",
            item3: "Avocado in 10 and 20 kilo boxes",
            item4: "Grapefruit in 20 kilo boxes",
            item5: "Persian lemon in cardboard and plastic boxes of 18 kilos"
        },
        benefits: {
            title: "Benefits of Lemon",
            intro: "Lemon is a highly consumed fruit in our gastronomy providing properties and nutrients that improve our body."
        },
        tips: {
            tip1: "To choose a lemon with a large amount of juice, choose the one with the thinnest skin and greater weight relative to its size.",
            tip2: "To better squeeze its juice, roll the lemon with a little pressure to soften its skin."
        },
        fact: {
            title: "Did you know...?",
            text: "Lemon was used by the English navy in the 18th century to prevent diseases in sailors and help them endure longer at sea."
        },
        benefitCards: {
            vitaminc: {
                title: "Rich in Vitamin C",
                desc: "Strengthens the immune system and helps prevent colds."
            },
            hydration: {
                title: "Hydration",
                desc: "Excellent for keeping you hydrated and refreshed throughout the day."
            },
            digestive: {
                title: "Digestive Health",
                desc: "Helps the digestive process by releasing harmful substances from the liver."
            },
            antioxidant: {
                title: "Antioxidant",
                desc: "Fights free radicals and promotes healthy skin."
            }
        },
        grapefruitBenefits: {
            title: "Grapefruit Benefits",
            intro: "Grapefruit is a nutrient-rich citrus fruit that provides multiple health benefits."
        },
        grapefruitBenefitCards: {
            vitaminc: {
                title: "High in Vitamin C",
                desc: "One grapefruit provides more than 100% of the recommended daily intake of vitamin C."
            },
            weightloss: {
                title: "Weight Control",
                desc: "Helps with weight loss by boosting metabolism and reducing appetite."
            },
            heart: {
                title: "Cardiovascular Health",
                desc: "Reduces cholesterol and improves heart health thanks to its antioxidants."
            },
            skin: {
                title: "Healthy Skin",
                desc: "Rich in antioxidants that protect skin from premature aging."
            }
        },
        avocadoBenefits: {
            title: "Avocado Benefits",
            intro: "Avocado is a superfood rich in healthy fats and essential nutrients."
        },
        avocadoBenefitCards: {
            healthyfats: {
                title: "Healthy Fats",
                desc: "Rich in monounsaturated fatty acids that benefit heart health."
            },
            fiber: {
                title: "High in Fiber",
                desc: "Improves digestion and helps maintain healthy blood sugar levels."
            },
            potassium: {
                title: "Rich in Potassium",
                desc: "Contains more potassium than bananas, essential for blood pressure."
            },
            nutrients: {
                title: "Nutrient Absorption",
                desc: "Helps absorb fat-soluble vitamins from other foods."
            }
        },
        mangoBenefits: {
            title: "Mango Benefits",
            intro: "Mango is a delicious tropical fruit that provides numerous health benefits."
        },
        mangoBenefitCards: {
            vitamins: {
                title: "Rich in Vitamins",
                desc: "Excellent source of vitamins A, C and E that strengthen the body."
            },
            digestion: {
                title: "Improves Digestion",
                desc: "Contains digestive enzymes that help break down food."
            },
            immune: {
                title: "Immune System",
                desc: "Strengthens the body's defenses thanks to its high vitamin C content."
            },
            skin: {
                title: "Healthy Skin",
                desc: "Mango antioxidants help maintain radiant and youthful skin."
            }
        },
        recipes: {
            title: "Lemon Recipes",
            intro: "Discover delicious ways to incorporate Mexican lemon into your cooking"
        },
        recipeCards: {
            ceviche: {
                tag: "Seafood",
                title: "Mexican Ceviche",
                desc: "Fresh fish marinated in lemon juice with onion, cilantro and chili.",
                time: "30 min",
                servings: "4 servings"
            },
            limonada: {
                tag: "Drinks",
                title: "Natural Lemonade",
                desc: "Refreshing drink with freshly squeezed lemon, water and a touch of mint.",
                time: "10 min",
                servings: "6 servings"
            },
            guacamole: {
                tag: "Sauces",
                title: "Perfect Guacamole",
                desc: "Creamy avocado with lemon, tomato, onion and fresh cilantro.",
                time: "15 min",
                servings: "4 servings"
            },
            tacos: {
                tag: "Dishes",
                title: "Tacos al Pastor",
                desc: "Delicious tacos with a touch of lemon that enhances all the flavors.",
                time: "45 min",
                servings: "6 servings"
            },
            pay: {
                tag: "Desserts",
                title: "Lemon Pie",
                desc: "Creamy dessert with cookie base and Mexican lemon filling.",
                time: "60 min",
                servings: "8 servings"
            },
            pollo: {
                tag: "Meats",
                title: "Lemon Chicken",
                desc: "Chicken breast marinated in lemon with aromatic herbs.",
                time: "40 min",
                servings: "4 servings"
            }
        },
        grapefruitRecipes: {
            title: "Grapefruit Recipes",
            intro: "Discover delicious ways to incorporate grapefruit into your cooking"
        },
        grapefruitRecipeCards: {
            ensalada: {
                tag: "Salads",
                title: "Grapefruit and Avocado Salad",
                desc: "Refreshing combination of grapefruit, avocado and fresh vegetables.",
                time: "20 min",
                servings: "4 servings"
            },
            agua: {
                tag: "Drinks",
                title: "Natural Grapefruit Water",
                desc: "Refreshing and nutritious drink perfect for summer.",
                time: "15 min",
                servings: "6 servings"
            },
            salmon: {
                tag: "Seafood",
                title: "Grapefruit Glazed Salmon",
                desc: "Salmon with a delicious citrus grapefruit glaze.",
                time: "35 min",
                servings: "4 servings"
            }
        },
        avocadoRecipes: {
            title: "Avocado Recipes",
            intro: "Delicious recipes featuring premium Hass avocado"
        },
        avocadoRecipeCards: {
            toast: {
                tag: "Breakfast",
                title: "Avocado Toast",
                desc: "Delicious healthy breakfast with creamy avocado.",
                time: "10 min",
                servings: "2 servings"
            },
            ensalada: {
                tag: "Salads",
                title: "Fresh Avocado Salad",
                desc: "Nutritious salad with avocado, chicken and vinaigrette.",
                time: "25 min",
                servings: "4 servings"
            },
            smoothie: {
                tag: "Drinks",
                title: "Green Avocado Smoothie",
                desc: "Creamy and energizing smoothie with avocado and spinach.",
                time: "5 min",
                servings: "2 servings"
            }
        },
        mangoRecipes: {
            title: "Mango Recipes",
            intro: "Explore the tropical flavor of Mexican mango"
        },
        mangoRecipeCards: {
            salsa: {
                tag: "Sauces",
                title: "Spicy Mango Salsa",
                desc: "Tropical salsa perfect for tacos and fish.",
                time: "15 min",
                servings: "4 servings"
            },
            agua: {
                tag: "Drinks",
                title: "Fresh Mango Water",
                desc: "Refreshing natural drink with sweet mango.",
                time: "10 min",
                servings: "6 servings"
            },
            postre: {
                tag: "Desserts",
                title: "Mango Mousse",
                desc: "Light and creamy dessert with natural mango.",
                time: "30 min",
                servings: "6 servings"
            }
        },
        clients: {
            title: "Our Clients",
            intro: "Companies that trust the quality of our products"
        },
        market: {
            title: "MARKET",
            intro: "Our delivery coverage spans strategic locations in various areas.",
            internacional: "INTERNATIONAL:",
            nacional: "NATIONAL:"
        },
        contact: {
            title: "CONTACT",
            internacional: "International",
            nacional: "National",
            whatsapp: "WhatsApp",
            direccion: "Address"
        },
        footer: {
            rights: "© 2024 CITRIMEX. All rights reserved.",
            slogan: "From Mexico to the World"
        },
        modals: {
            mision: {
                title: "Mission",
                text: "We are a leading company in the industry that produces, packs and commercializes Mexican Lemon, providing our customers with a fresh, juicy, high-quality product at competitive prices.",
                highlight: "Fresh and high-quality product"
            },
            vision: {
                title: "Vision",
                text: "To be a leading company in the global market with quality products, as a result of commitment, constant innovation, teamwork and sustainable growth, preparing ourselves for the highest demands.",
                highlight: "More than 40 years of experience"
            },
            valores: {
                title: "Values",
                intro: "Institutional values based on the analysis of our operations, trajectory and organizational culture:"
            },
            valoresInd: {
                calidad: {
                    title: "Quality",
                    text: "It involves offering products that meet the highest standards of freshness, hygiene, flavor and presentation. At Grupo Citrimex, it means taking care of each stage: from the selection of lemon and other citrus fruits to their packaging and delivery, ensuring that the customer receives an impeccable product."
                },
                confianza: {
                    title: "Trust",
                    text: "It is the security that the company conveys to customers, collaborators and partners. At Citrimex it is reflected through transparency in processes, compliance with agreements, punctuality in deliveries and responsible production management, generating solid and long-term relationships."
                },
                equipo: {
                    title: "Teamwork",
                    text: "It refers to harmonious collaboration between all areas: field, selection, packaging, logistics, sales and administration. The goal is to unite efforts and skills to fulfill the company's mission and maintain an efficient flow of high-quality products."
                },
                pasion: {
                    title: "Passion",
                    text: "It is the commitment and energy with which each collaborator performs their work. At Citrimex, passion translates into pride in the Mexican product, daily dedication and a positive attitude to overcome challenges, always seeking to be better."
                },
                consumidor: {
                    title: "Customer Focus",
                    text: "It means understanding the needs of national and international customers, anticipating their expectations and offering products that meet their standards. This includes freshness, presentation, competitive price and reliable, personalized service."
                },
                eficiencia: {
                    title: "Efficiency",
                    text: "It is the ability to carry out processes with the least possible waste of time, resources and effort. At Grupo Citrimex it means optimizing packaging lines, logistics, infrastructure use, technology and labor to achieve high production volumes with controlled costs."
                }
            }
        },
        recipeModals: {
            common: {
                ingredientsTitle: "Ingredients",
                preparationTitle: "Preparation",
                difficulty: "Easy"
            },
            ceviche: {
                difficulty: "Easy",
                ingredients: [
                    "500g fresh white fish \"tilapia or sea bass\"",
                    "1 cup Mexican lemon juice \"approx. 10-12 lemons\"",
                    "1 red onion, finely chopped",
                    "2 tomatoes, diced",
                    "1/2 cup fresh cilantro, chopped",
                    "2 serrano peppers, chopped \"optional\"",
                    "1 cucumber, diced",
                    "Salt and pepper to taste",
                    "Avocado for serving",
                    "Tostadas or crackers"
                ],
                steps: [
                    "Cut the fish into small cubes of approximately 1 cm and place them in a glass container.",
                    "Pour the lemon juice over the fish, making sure it is completely covered. Refrigerate for 20-30 minutes.",
                    "While the fish \"cooks\" in the lemon, prepare all the vegetables: chop the onion, tomato, cilantro, chili and cucumber.",
                    "Once the fish is opaque \"sign that it's ready\", drain the excess lemon juice.",
                    "Mix the fish with the onion, tomato, cilantro, chili and cucumber.",
                    "Season with salt and pepper to taste. You can add a little more fresh lemon juice.",
                    "Serve immediately with sliced avocado and tostadas. Enjoy!"
                ],
                tip: "Use freshly squeezed Mexican lemon for the best flavor. The lemon should be at room temperature to extract more juice."
            },
            limonada: {
                difficulty: "Very easy",
                ingredients: [
                    "1 cup Mexican lemon juice \"8-10 lemons\"",
                    "1 liter cold water",
                    "3/4 cup sugar \"adjust to taste\"",
                    "Fresh mint leaves \"optional\"",
                    "Ice to taste",
                    "Lemon slices for garnish"
                ],
                steps: [
                    "Squeeze the lemons and strain the juice to remove the seeds.",
                    "In a large pitcher, dissolve the sugar in a cup of warm water.",
                    "Add the lemon juice and the rest of the cold water. Mix well.",
                    "Taste and adjust sweetness according to your preference.",
                    "Add the mint leaves if desired and refrigerate for 15 minutes.",
                    "Serve with plenty of ice and garnish with lemon slices."
                ],
                tip: "For a more refreshing lemonade, freeze lemonade cubes and use them instead of regular ice. This way your drink won't get watered down!"
            },
            guacamole: {
                difficulty: "Easy",
                ingredients: [
                    "3 ripe avocados",
                    "Juice of 2 Mexican lemons",
                    "1/2 white onion, finely chopped",
                    "1 tomato, diced small",
                    "1/4 cup fresh cilantro, chopped",
                    "1-2 serrano peppers, chopped \"to taste\"",
                    "Salt to taste",
                    "Tortilla chips for serving"
                ],
                steps: [
                    "Cut the avocados in half, remove the pit and extract the pulp with a spoon.",
                    "In a molcajete or bowl, mash the avocado with a fork until you get the desired texture.",
                    "Immediately add the lemon juice and mix well \"this prevents oxidation\".",
                    "Add the onion, tomato, cilantro and chili. Mix gently.",
                    "Season with salt to taste and adjust lemon if necessary.",
                    "Serve immediately with crispy tortilla chips. Enjoy!"
                ],
                tip: "Lemon is key to prevent guacamole from oxidizing. Add enough juice and cover with plastic wrap directly on the surface if you're going to store it."
            },
            tacos: {
                difficulty: "Intermediate",
                ingredients: [
                    "1 kg pork in thin slices",
                    "4 guajillo peppers \"seedless\"",
                    "2 ancho peppers \"seedless\"",
                    "1/2 cup Mexican lemon juice",
                    "1/4 pineapple, cubed",
                    "1/2 onion + more for serving",
                    "3 garlic cloves",
                    "1 tsp cumin, oregano and achiote",
                    "Corn tortillas",
                    "Cilantro, onion and lemons for serving"
                ],
                steps: [
                    "Hydrate the peppers in hot water for 15 minutes. Blend them with garlic, onion, spices and lemon juice.",
                    "Marinate the meat with the marinade for at least 2 hours (better overnight).",
                    "Cook the meat in a hot skillet or grill until golden and cooked.",
                    "Chop the meat into small pieces. Brown the pineapple cubes in the same skillet.",
                    "Heat the tortillas and assemble the tacos with the meat and pineapple.",
                    "Serve with chopped onion, cilantro and a generous squeeze of fresh lemon."
                ],
                tip: "Lemon at the end is essential. Squeeze fresh lemon over each taco just before eating to enhance all the flavors."
            },
            pay: {
                difficulty: "Intermediate",
                ingredients: [
                    "Crust: 2 cups crushed Maria cookies + 100g melted butter",
                    "Filling: 1 can sweetened condensed milk (397g)",
                    "1 can evaporated milk (360ml)",
                    "1 cup Mexican lemon juice (10-12 lemons)",
                    "Zest of 2 lemons",
                    "4 egg yolks",
                    "Meringue: 4 egg whites + 1/2 cup sugar"
                ],
                steps: [
                    "Mix the crushed cookies with the butter. Press into a pie pan and bake 10 min at 180°C.",
                    "Blend the condensed milk, evaporated milk, yolks, juice and lemon zest until integrated.",
                    "Pour the filling over the crust and bake 20 minutes at 180°C until set.",
                    "For the meringue: beat the egg whites to stiff peaks, add sugar gradually.",
                    "Cover the pie with the meringue and bake 5-10 minutes until golden.",
                    "Refrigerate for at least 4 hours before serving. Delicious!"
                ],
                tip: "Use room temperature lemons and roll them before squeezing to get more juice. The zest adds an incredible aroma."
            },
            pollo: {
                difficulty: "Easy",
                ingredients: [
                    "4 chicken breasts",
                    "1/2 cup Mexican lemon juice",
                    "Zest of 2 lemons",
                    "4 garlic cloves, minced",
                    "2 tbsp olive oil",
                    "1 tsp dried oregano",
                    "1 tsp thyme",
                    "Salt and pepper to taste",
                    "Fresh parsley for garnish"
                ],
                steps: [
                    "Mix the lemon juice, zest, garlic, oil, oregano, thyme, salt and pepper.",
                    "Marinate the breasts in this mixture for at least 30 minutes (better 2 hours).",
                    "Heat a skillet over medium-high heat with a little oil.",
                    "Cook the breasts 6-7 minutes per side until golden and cooked through.",
                    "Pour the remaining marinade into the skillet and cook 2 more minutes.",
                    "Serve with the cooking juices, garnish with parsley and lemon slices."
                ],
                tip: "Don't marinate the chicken for more than 4 hours, as the lemon acid can change the texture of the meat. The ideal time is 30 min to 2 hours."
            }
        }
    }
};

let currentLanguage = localStorage.getItem('language') || 'es';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('lang-btn--active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('lang-btn--active');
        }
    });

    // Update page content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[lang];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }

        if (value) {
            element.textContent = value;
        }
    });

    // Update recipe modals content
    updateRecipeModals(lang);

    // Update document language
    document.documentElement.lang = lang === 'es' ? 'es-MX' : 'en';
}

// Function to update recipe modals dynamically
function updateRecipeModals(lang) {
    const recipes = ['ceviche', 'limonada', 'guacamole', 'tacos', 'pay', 'pollo'];
    const t = translations[lang].recipeModals;

    recipes.forEach(recipeName => {
        const modal = document.getElementById(`modal-recipe-${recipeName}`);
        if (!modal || !t[recipeName]) return;

        const recipe = t[recipeName];
        const common = t.common;

        // Update difficulty
        const difficultySpan = modal.querySelector('.recipe-modal__meta span:last-child');
        if (difficultySpan) {
            difficultySpan.textContent = `${recipe.difficulty}`;
        }

        // Update ingredients title
        const ingredientsTitle = modal.querySelector('.recipe-modal__section h4');
        if (ingredientsTitle) {
            ingredientsTitle.textContent = common.ingredientsTitle;
        }

        // Update ingredients list
        const ingredientsList = modal.querySelector('.recipe-modal__ingredients');
        if (ingredientsList && recipe.ingredients) {
            ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');
        }

        // Update preparation title
        const preparationTitle = modal.querySelectorAll('.recipe-modal__section h4')[1];
        if (preparationTitle) {
            preparationTitle.textContent = common.preparationTitle;
        }

        // Update preparation steps
        const stepsList = modal.querySelector('.recipe-modal__steps');
        if (stepsList && recipe.steps) {
            stepsList.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');
        }

        // Update tip
        const tipDiv = modal.querySelector('.recipe-modal__tip');
        if (tipDiv && recipe.tip) {
            tipDiv.innerHTML = `<strong>Tip CITRIMEX:</strong> ${recipe.tip}`;
        }
    });
}

// Language button listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
    });
});

// Set initial language
setLanguage(currentLanguage);

// ===== CONSOLE MESSAGE =====
console.log('%cCITRIMEX - De México para el mundo', 'color: #1a4d2e; font-size: 20px; font-weight: bold; font-family: "Playfair Display", serif;');
console.log('%cSitio web desarrollado con tecnologías modernas', 'color: #72ef36; font-size: 14px;');
