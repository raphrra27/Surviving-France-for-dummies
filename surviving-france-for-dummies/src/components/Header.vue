<template>
    <header class="navbar">
        <RouterLink to="/" id="logo"><img src="/logo.png" alt="logo-surviving"></RouterLink>
        <nav class="navbar-links">
            <RouterLink to="/article" class="links" id="article-nav">Articles</RouterLink>
            <RouterLink to="/map" class="links" id="map-nav">Map</RouterLink>
            <RouterLink to="/quiz" class="links" id="quiz-nav">Quiz</RouterLink>
            <RouterLink to="/ranking" class="links" id="ranking-nav">Ranking</RouterLink>
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

#logo {
    display: flex;
    justify-self: start;
}
#logo img {
    width: 178px;
    height: 59px;
    object-fit: contain;
}
</style>
