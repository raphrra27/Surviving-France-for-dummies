<script setup>
    import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
    import { useRoute } from "vue-router";

    const route = useRoute();
    const linksRef = ref(null);
    const bar = ref({ left: 0, width: 0, visible: false });

    function moveBar() {
        let lienActif = linksRef.value.querySelector(".router-link-active");

        if (lienActif == null) {
            bar.value.visible = false;
        } else {
            bar.value.left = lienActif.offsetLeft;
            bar.value.width = lienActif.offsetWidth;
            bar.value.visible = true;
        }
    }

    // Menu téléphone
    const menuOpen = ref(false);

    function closeMenuOnDesktop() {
        if (window.innerWidth > 768) {
            menuOpen.value = false;
        }
    }

    // Empêche la page de défiler derrière le menu ouvert
    watch(menuOpen, function (open) {
        document.body.style.overflow = open ? "hidden" : "";
    });

    watch(() => route.path, function () {
        menuOpen.value = false;
        nextTick(moveBar);
    });

    onMounted(function () {
        nextTick(moveBar);
        window.addEventListener("resize", moveBar);
        window.addEventListener("resize", closeMenuOnDesktop);
    });

    onBeforeUnmount(function () {
        window.removeEventListener("resize", moveBar);
        window.removeEventListener("resize", closeMenuOnDesktop);
        document.body.style.overflow = "";
    });
</script>

<template>
    <header class="navbar">
        <nav class="navbar-logo">
            <RouterLink to="/" id="logo"><img src="/logo.png" alt="logo-surviving"></RouterLink>
        </nav>
        <nav class="navbar-links" ref="linksRef">
            <RouterLink to="/article" class="links" id="article-nav">Articles</RouterLink>
            <RouterLink to="/map" class="links" id="map-nav">Map</RouterLink>
            <RouterLink to="/quiz" class="links" id="quiz-nav">Quiz</RouterLink>
            <RouterLink to="/ranking" class="links" id="ranking-nav">Ranking</RouterLink>

            <span
                class="nav-bar"
                :style="{
                    transform: `translateX(${bar.left}px)`,
                    width: bar.width + 'px',
                    opacity: bar.visible ? 1 : 0,
                }"
            />
        </nav>
        <nav class="navbar-profil">
            <RouterLink to="/profil" id="profil-nav">
                <img src="../../public/profil-picture-ex.jpeg" alt="profil pictures" id="profil-pict-nav">
                <span id="profil-text">Name <br> Badges</span>
            </RouterLink>
        </nav>

        <!-- Boutons visibles uniquement sur téléphone -->
        <div class="mobile-actions">
            <RouterLink to="/profil" class="mobile-profil" aria-label="Profil">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
            </RouterLink>
            <button class="burger" @click="menuOpen = true" aria-label="Ouvrir le menu" :aria-expanded="menuOpen">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
            </button>
        </div>

        <!-- Menu plein écran (téléphone) -->
        <div class="mobile-menu" v-if="menuOpen">
            <div class="mobile-menu-top">
                <RouterLink to="/" id="mobile-menu-logo"><img src="/logo.png" alt="logo-surviving"></RouterLink>
                <button class="close" @click="menuOpen = false" aria-label="Fermer le menu">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M5 5l14 14M19 5L5 19" />
                    </svg>
                </button>
            </div>

            <div class="user-card">
                <RouterLink to="/profil" class="user-info">
                    <span class="user-avatar">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                    </span>
                    <span>
                        <span class="user-name">Name →</span>
                        <span class="user-badge">Badges</span>
                    </span>
                </RouterLink>
                <button type="button" class="logout">Log out</button>
            </div>

            <nav class="mobile-links">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/article">Articles</RouterLink>
                <RouterLink to="/map">Map</RouterLink>
                <RouterLink to="/quiz">Quiz</RouterLink>
                <RouterLink to="/ranking">Ranking</RouterLink>
            </nav>

            <div class="mobile-menu-bottom">
                <RouterLink to="/aboutus">About us</RouterLink>
                <a href="#">Mentions légales</a>
            </div>
        </div>
    </header>
</template>

<style scoped>
.navbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    background-color: #FFEE00;
    height: 84px;
    padding: 0 40px;
}

.navbar-links {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 55px;
}

.navbar a,
.navbar a:visited,
.navbar a:hover,
.navbar a:active {
    text-decoration: none;
    color: inherit;
}

.links,
#profil-nav {
    color: black;
    font-family: Dummies;
}

#map-nav {
    color: black;
    font-size: 22px;
    font-family: Dummies;
}
#quiz-nav {
    color: black;
    font-size: 22px;
    font-family: Dummies;
}
#ranking-nav {
    color: black;
    font-size: 22px;
    font-family: Dummies;
}
#article-nav {
    color: black;
    font-size: 22px;
    font-family: Dummies;
}

.links {
    font-size: 22px;
}

.navbar-logo {
    justify-self: start;
}

#logo {
    display: flex;
}
#logo img {
    width: 178px;
    height: 59px;
    object-fit: contain;
}

#profil-pict-nav {
    width: 48px ;
    height: 48px;
    object-fit: cover;
    border-radius: 50%;
}

.navbar-profil {
    justify-self: end;
}

#profil-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    line-height: 1.2;
}

#profil-text {
    text-align: left;
}

.nav-bar {
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 3px;
    background: black;
    border-radius: 2px;
    transition: transform 0.3s ease, width 0.3s ease, opacity 0.2s;
    pointer-events: none;
}

.mobile-actions,
.mobile-menu {
    display: none;
}

.navbar button {
    background: none;
    border: none;
    padding: 0;
    color: black;
    cursor: pointer;
    display: flex;
}

@media (max-width: 768px) {
    .navbar {
        grid-template-columns: 1fr auto;
        height: 72px;
        padding: 0 20px;
    }

    .navbar-links,
    .navbar-profil {
        display: none;
    }

    #logo img {
        width: 150px;
        height: 50px;
    }

    .mobile-actions {
        display: flex;
        align-items: center;
        gap: 18px;
    }

    .mobile-profil {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        border: 2px solid black;
        border-radius: 50%;
        background-color: #D9D9D9;
    }

    /* Menu plein écran */
    .mobile-menu {
        display: flex;
        flex-direction: column;
        position: fixed;
        inset: 0;
        z-index: 100;
        overflow-y: auto;
        background-color: #FFEE00;
        color: black;
        padding: 0 20px 40px;
        font-family: Dummies;
    }

    .mobile-menu-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        flex-shrink: 0;
    }

    #mobile-menu-logo {
        display: flex;
    }
    #mobile-menu-logo img {
        width: 150px;
        height: 50px;
        object-fit: contain;
    }

    .user-card {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        padding: 16px;
        border-radius: 16px;
        background-color: black;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
        min-width: 0;
    }

    .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #FFEE00;
        color: black;
    }

    .user-name,
    .user-badge {
        display: block;
        text-transform: uppercase;
    }
    .user-name {
        color: #FFEE00;
        font-size: 20px;
    }
    .user-badge {
        color: white;
        font-size: 15px;
    }

    .navbar button.logout {
        color: #FFEE00;
        font-family: Dummies;
        font-size: 15px;
        text-decoration: underline;
        cursor: default;
    }

    .mobile-links {
        display: flex;
        flex-direction: column;
        margin-top: 24px;
    }

    .mobile-links a {
        padding: 6px 0;
        border-bottom: 3px solid black;
        font-size: 34px;
        text-transform: uppercase;
        color: black;
    }

    .mobile-menu-bottom {
        display: flex;
        gap: 22px;
        margin-top: auto;
        padding-top: 40px;
    }

    .navbar .mobile-menu-bottom a {
        font-size: 16px;
        text-decoration: underline;
        color: black;
    }
}
</style>
