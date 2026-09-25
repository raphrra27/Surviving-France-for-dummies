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

    watch(() => route.path, function () {
        nextTick(moveBar);
    });

    onMounted(function () {
        nextTick(moveBar);
        window.addEventListener("resize", moveBar);
    });

    onBeforeUnmount(function () {
        window.removeEventListener("resize", moveBar);
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
</style>
