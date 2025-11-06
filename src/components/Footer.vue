<script setup>
</script>

<template>
	<footer class="footer">
		<div class="footer-content">
			<div class="footer-section" id="kontakt">
				<h3>Kontakt</h3>
				<p>📍 TU Berlin, Mathematikgebäude <br>MA 001</p>
				<p>📧 <a href="mailto:charlie@unifilm.de">charlie@unifilm.de</a></p>
			</div>
			
			<div class="footer-section">
				<h3>Spielzeiten</h3>
				<p>Dienstags: 18:45 Uhr</p>
				<p>Abendkasse: 18:30 Uhr</p>
				<p>Sondervorstellungen: Nach Ankündigung</p>
			</div>
			
			<div class="footer-section">
				<h3>Folge uns</h3>
				<div class="social-links">
					<a href="https://www.facebook.com/Filmclub.TU" class="social-link" aria-label="Facebook">📘</a>
					<a href="https://www.instagram.com/unikinotuberlin" class="social-link" aria-label="Instagram">📷</a>
					<a href="https://www.tiktok.com/@unikinotuberlin" class="social-link" aria-label="Twitter">🔊</a>
				</div>
			</div>
			
			<div class="footer-section">
				<h3>Über uns</h3>
				<p>Der Charlies Campus Filmclub ist das studentische Kino der TU Berlin. Seit über 20 Jahren bringen wir großes Kino auf den Campus!</p>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.footer {
	background-color: #111;
	color: #ccc;
	padding: 3rem 2rem;
	margin-top: auto; /* Stellt sicher, dass der Footer am Ende der Seite bleibt */
	font-size: 0.9rem;
}

.footer-content {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.footer-section {
	flex: 1;
	min-width: 220px; /* Sorgt für einen guten Umbruch auf kleineren Bildschirmen */
}

.footer-section h3 {
	color: #ffcc00; /* Akzentfarbe */
	margin-bottom: 1rem;
	font-size: 1.2rem;
}

.footer-section p {
	margin: 0.5rem 0;
	line-height: 1.6;
}

.footer-section a {
	color: #ccc;
	text-decoration: none;
	transition: color 0.3s ease;
}

.footer-section a:hover {
	color: #ffcc00;
}

.social-links {
	display: flex;
	gap: 1.5rem;
	margin-top: 1rem;
}

.social-link {
	font-size: 1.8rem;
	transition: transform 0.3s ease;
}

.social-link:hover {
	transform: scale(1.2);
}
</style>