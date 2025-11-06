<script setup>
import { ref } from 'vue';

// Props können hier definiert werden, falls du den Titel von außen übergeben möchtest.
defineProps({ title: String, nextEvent: Object, user: Object })

const isMenuOpen = ref(false);

function toggleMenu() {
	isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
	if (isMenuOpen.value) {
		isMenuOpen.value = false;
	}
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatSimpleDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('de-DE', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' Uhr';
}

</script>

<template>
	<nav class="navbar">
		<a class="brand" href="#" @click.prevent="closeMenu">
			<img @click="scrollToTop" src="../assets/hut_charlie.png" alt="Logo" class="logo">
		</a>

		<div class="next-event-info" v-if="nextEvent">
			<span class="next-event-label">NÄCHSTES EVENT</span>
			<span class="next-event-details">{{ nextEvent.title }} - {{ formatSimpleDate(nextEvent.eventDate) }}</span>
		</div>

		<button class="hamburger-menu" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }" aria-label="Menü öffnen/schließen">
			<span></span>
			<span></span>
			<span></span>
		</button>

		<div class="nav-links" :class="{ 'is-open': isMenuOpen }">
			<a href="#programm" @click="closeMenu">Programm</a>
			<a href="#about" @click="closeMenu">Über uns</a>
			<a href="#preise" @click="closeMenu">Preise</a>
			<a href="#kontakt" @click="closeMenu">Kontakt</a>
			<!-- Bedingter Link für Login/Admin mit router-link -->
			<router-link v-if="!user" to="/login" @click="closeMenu">Login</router-link>
			<router-link v-if="user" to="/admin" @click="closeMenu">Admin</router-link>

		</div>
	</nav>
</template>

<style scoped>
.navbar {
	background-color: #111; /* Dunkler Hintergrund für Kino-Atmosphäre */
	color: #fff;
	padding: 0 1rem; /* Links/Rechts Abstand */
	display: grid; /* Umstellung auf Grid für präzise Zentrierung */
	grid-template-columns: auto 1fr auto; /* Logo/Menü nehmen min. Platz, Mitte füllt den Rest */
	align-items: center;
	height: 70px; /* Feste Höhe für Konsistenz */
	position: sticky;
	top: 0;
	z-index: 1000;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.brand {
	display: flex;
	align-items: center; /* Logo in der ersten Spalte (Standard) */
	text-decoration: none;
	color: #ffcc00; /* Goldene Akzentfarbe, passend zum Kino-Thema */
}

.logo {
	height: 30px;
	width: auto;
	transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.2);
}

/* --- Info zum nächsten Event --- */
.next-event-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fff;
	text-align: center;
	grid-column: 2; /* Event-Info in der mittleren Spalte, die jetzt flexibel ist */
}

.next-event-label {
	font-size: 0.7rem;
	font-weight: bold;
	color: #ffcc00;
	letter-spacing: 1px;
}

.next-event-details {
	font-size: 0.9rem;
}

/* --- Hamburger Menu --- */
.hamburger-menu {
	display: flex; /* Immer sichtbar */	
	grid-column: 3; /* Hamburger in der dritten Spalte */
	flex-direction: column;
	justify-content: space-around;
	width: 2rem;
	height: 2rem;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	z-index: 10;
}

.hamburger-menu span {
	width: 2rem;
	height: 0.25rem;
	background: #ffcc00;
	border-radius: 10px;
	transition: all 0.3s linear;
	position: relative;
	transform-origin: 1px;
}

/* Animation für das "X" */
.hamburger-menu.is-active span:nth-child(1) {
	transform: rotate(45deg);
}
.hamburger-menu.is-active span:nth-child(2) {
	opacity: 0;
	transform: translateX(20px);
}
.hamburger-menu.is-active span:nth-child(3) {
	transform: rotate(-45deg);
}

/* --- Navigations-Links --- */
.nav-links {
	position: fixed;
	top: 0;
	right: -300px; /* Standardmäßig außerhalb des Bildschirms */
	width: 300px; /* Feste Breite für das Seitenmenü */
	height: 100vh;
	background-color: rgba(17, 17, 17, 0.98);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3rem;
	transition: right 0.4s ease-in-out;
	box-shadow: -5px 0 15px rgba(0,0,0,0.5);
}.nav-links a,
.nav-links .router-link-active {
	color: #fff;
	text-decoration: none;
	font-size: 1rem;
	font-weight: 500;
	font-size: 1.5rem;
	color: #ffcc00;
	transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links .router-link-active:hover {
	color: #ffcc00;
}

.nav-links.is-open {
	right: 0; /* Ins Bild schieben */
}

/* --- Responsive Design für Mobile --- */
@media (max-width: 768px) {
	/* Media Query ist nicht mehr nötig, da das Verhalten jetzt global ist */
}
</style>