<script setup>
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <footer class="footer">
        <div class="top">
            <div class="part1">
                <img src="../../public/logo.png" alt="logo" id="logo">
                <p>The no-panic guide to living in <br> France: paperwork, bakeries, <br> strikes and la bise.</p>
            </div>
            <div class="part2">
                <p class="title">ABOUT US</p>
                <p>Three students from France who <br> want to show how France is a <br> complex culture.</p>
                <RouterLink to="/aboutus" class="link">More about us →</RouterLink>
                <a href="mailto:surviving@france.com" class="link">surviving@france.com</a>
            </div>
            <div class="part3">
                <p class="title">LEGAL</p>
                <a href="#">Mentions légales</a>
                <a href="#">Privacy policy</a>
                <a href="#">Cookies</a>
                <a href="#">Terms of use</a>
            </div>
        </div>
        <div class="bottom">
            <p>© 2026 Surviving France</p>
            <button class="to-top" @click="scrollToTop" aria-label="Back to top">↑</button>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: black;
    color: white;
    font-family: Dummies;
    padding: 50px 80px 30px;
}

.top,
.bottom {
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
}

.top {
    display: flex;
    justify-content: center;
    gap: 100px;
}

.top > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

#logo {
    width: 240px;
    max-width: 100%;
    height: 80px;
    object-fit: contain;
    margin: 10px 0 20px;
}

p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
}

.title {
    color: #FFEE00;
    font-size: 22px;
    margin-bottom: 10px;
}

a {
    color: white;
    text-decoration: none;
    font-size: 16px;
}

a.link {
    text-decoration: underline;
}

a:hover {
    color: #FFEE00;
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 238, 0, 0.6);
}

.bottom p {
    font-size: 14px;
}

.to-top {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background-color: white;
    color: black;
    font-size: 22px;
    cursor: pointer;
}

.to-top:hover {
    background-color: #FFEE00;
}
</style>
