<script setup>
import { ref } from 'vue';

import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';

// Empfängt die Filmliste von der App.vue Komponente
defineProps({
  movies: Array
});

function scrollToProgramm() {
	const programmSection = document.getElementById("programm");
	if (programmSection) {
		programmSection.scrollIntoView({ behavior: "smooth" });
	}
}

function formatSimpleDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('de-DE', {
    weekday: 'long', // z.B. Dienstag
    day: '2-digit',    // z.B. 03
    month: '2-digit',  // z.B. 12
    year: 'numeric',   // z.B. 2024
    hour: '2-digit',
    minute: '2-digit',
  }) + ' Uhr';
}

const carouselImages = ref([
  { src: image1, alt: 'Unser Kinosaal', caption: 'Unser gemütlicher Kinosaal MA 001' },
  { src: image2, alt: 'Glühweinbowle', caption: 'Glühweinbowle' },
  { src: image3, alt: 'Snacks und Getränke', caption: 'Frisches Popcorn und weitere Snacks & Getränke' }
]);

const currentIndex = ref(0);

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % carouselImages.value.length;
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + carouselImages.value.length) % carouselImages.value.length;
}

</script>



<template>

<section class="hero">
	<div>
		<h1> Charlies Campus Filmclub </h1>
		<p class="subtitle">Das Unikino der TU Berlin</p>
		<button class="programmButton" @click="scrollToProgramm">Programm ansehen</button>
	</div>
</section>

<section id="about" class="about-section">
	<div class="about-container">
		<h2>Das erwartet dich bei uns</h2>
		<div class="features-grid">
			<div class="feature-item">
				<div class="feature-icon">🎬</div>
				<h3>Vielfältiges Programm</h3>
				<p>Von Blockbustern über Kultklassiker bis hin zu Arthouse – bei uns ist für jeden Geschmack etwas dabei. (Alle Filme in OmdU)</p>
			</div>
			<div class="feature-item">
				<div class="feature-icon">💰</div>
				<h3>Echte Studentenpreise</h3>
				<p>Großes Kino für kleines Geld. Genieße aktuelle Filme zu Preisen, die dein Budget schonen.</p>
			</div>
			<div class="feature-item">
				<div class="feature-icon">✨</div>
				<h3>Einzigartige Atmosphäre</h3>
				<p>Unser Kino ist ein Ort zum Wohlfühlen und Abschalten vom Uni-Alltag.</p>
			</div>
			<div class="feature-item">
				<div class="feature-icon">🍿</div>
				<h3>Snacks & Getränke</h3>
				<p>Was wäre Kino ohne Popcorn? Wir versorgen dich mit Snacks und kühlen Getränken zu fairen Preisen.</p>
			</div>
		</div>
	</div>
</section>

<section id="caroussel" class="caroussel-section">
  <div class="caroussel-container">
    <h2>Unser Kino & Team</h2>
    <div class="carousel">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="carousel-item" v-for="(image, index) in carouselImages" :key="index">
          <img :src="image.src" :alt="image.alt">
          <div class="carousel-caption">{{ image.caption }}</div>
        </div>
      </div>
      <button @click="prevSlide" class="carousel-control prev" aria-label="Vorheriges Bild">❮</button>
      <button @click="nextSlide" class="carousel-control next" aria-label="Nächstes Bild">❯</button>
      <div class="carousel-dots">
        <span v-for="(image, index) in carouselImages" :key="index" :class="{ active: currentIndex === index }" @click="currentIndex = index"></span>
      </div>
    </div>
  </div>
</section>

<section id="programm">
	<h2>Aktuelles Programm</h2>

	<div class="movie-grid">
		<div v-for="movie in movies" :key="movie.id" class="movie-card">
			<img :src="movie.image_url || 'https://image.film.at/images/original/8957047/47E73o4xegeczwwSijOdVMzxkAA.jpg'" :alt="`Filmcover von ${movie.title}`" class="movie-cover">
			<div class="movie-overlay">
				<h3 class="movie-title">{{ movie.title }}</h3>
				<p class="movie-date">{{ formatSimpleDate(movie.eventDate) }}</p>
			</div>
		</div>
	</div>
</section>

</template>



<style scoped>
/* --- Hero Section --- */
.hero {
	/* Füllt die verbleibende Bildschirmhöhe unter der Navbar (angenommene Höhe: 70px) */
	min-height: calc(100vh - 140px);
	display: flex;
	flex-direction: column; /* WICHTIG: Richtet die Flex-Items untereinander aus */
	/* Inhalt am Anfang (oben) ausrichten... */
	justify-content: flex-start;
	align-items: center;
	text-align: center;
	/* ...und dann mit padding-top um 25% der Viewport-Höhe nach unten schieben. */
	padding: 10vh 2rem 0; /* Wert reduziert, um den Inhalt nach oben zu verschieben */
	color: #fff;
	background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80') no-repeat center center;
	background-size: cover;
}

.hero h1 {
	font-size: 3.5rem;
	font-weight: 700; 
	color: #ffcc00;
	text-shadow: 0 2px 15px rgba(0,0,0,0.5);
	margin-bottom: 0.5rem;
}

.hero .subtitle {
	font-size: 1.5rem;
	margin-bottom: 2rem;
	font-weight: 300;
}

.programmButton {
	background-color: #ffcc00;
	color: #111;
	border: none;
	padding: 0.8rem 2rem;
	font-size: 1.1rem;
	font-weight: bold;
	border-radius: 50px;
	cursor: pointer;
	transition: transform 0.2s ease, background-color 0.2s ease;
}

.programmButton:hover {
	transform: scale(1.05);
	background-color: #ffd633;
}

/* --- About Section --- */
.about-section {
	background-color: #1a1a1a; /* Angepasst an Programm-Sektion */
	color: #fff;
	padding: 2rem 2rem;
	text-align: center;
}

.about-container {
	max-width: 1200px;
	margin: 0 auto;
}

.about-section h2 {
	font-size: 2.5rem;
	color: #ffcc00;
	margin-bottom: 3rem;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
}

.feature-item {
	background-color: #1a1a1a;
	padding: 1.5rem;
	border-radius: 8px;
	border: 1px solid #2a2a2a;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7); /* Angepasst an Filmkarten */
	transition: transform 0.3s ease, border-color 0.3s ease; /* Transition hinzugefügt */
}

.feature-item:hover {
	transform: scale(1.05); /* Hover-Effekt wie bei Filmkarten */
	border-color: #ffcc00;
}

.feature-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
}

.feature-item h3 {
	font-size: 1.3rem;
	color: #ffcc00;
	margin-bottom: 0.5rem;
}

.feature-item p {
	color: #ccc;
	line-height: 1.6;
}

/* --- Caroussel Section --- */
.caroussel-section {
  background-color: #111;
  padding: 4rem 1rem;
}

.caroussel-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.caroussel-section h2 {
  font-size: 2.5rem;
  color: #ffcc00;
  margin-bottom: 2.5rem;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 60vh;
  object-fit: cover;
  display: block;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: #fff;
  padding: 2rem 1rem 1rem;
  font-size: 1.2rem;
  text-align: center;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffcc00;
  border: none;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;
}

.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.carousel-control.prev { left: 10px; border-radius: 5px 0 0 5px; }
.carousel-control.next { right: 10px; border-radius: 0 5px 5px 0; }

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.carousel-dots span {
  width: 12px; height: 12px; background-color: rgba(255, 255, 255, 0.5); border-radius: 50%; cursor: pointer; transition: background-color 0.3s ease;
}
.carousel-dots span.active { background-color: #ffcc00; }

/* --- Programm Section --- */
#programm {
	padding: 4rem 1rem;
	background-color: #1a1a1a;
}

#programm h2 {
	text-align: center;
	font-size: 2.5rem;
	color: #ffcc00;
	margin-bottom: 2.5rem;
}

.movie-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 2rem;
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.movie-card {
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
	transition: transform 0.3s ease;
}

.movie-card:hover {
	transform: scale(1.05);
}

.movie-cover {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.movie-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	opacity: 0;
	transition: opacity 0.3s ease;
	padding: 1rem;
}

.movie-card:hover .movie-overlay {
	opacity: 1;
}

.movie-title {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
}

.movie-date {
	font-size: 0.9rem;
	color: #ffcc00;
}

/* --- Responsive Design --- */
@media (max-width: 768px) {
	.hero h1 {
		font-size: 2.5rem;
	}
	.hero .subtitle {
		font-size: 1.2rem;
	}
	#programm {
		padding: 3rem 1rem;
	}
	#programm h2 {
		font-size: 2rem;
	}
	.about-section h2 {
		font-size: 2rem;
	}
	.caroussel-section h2 {
		font-size: 2rem;
	}
	.carousel-item img {
		height: 40vh;
	}
	.carousel-caption { font-size: 1rem; }
}
</style>