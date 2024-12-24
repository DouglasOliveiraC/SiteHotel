<!-- src/components/HeaderVisitor.vue -->
<script>
    export default {
        name: 'HeaderVisitor',
    };
</script>

<template>
    <header>
        <nav>
            <ul class="menu">
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/about">Sobre</router-link></li>
                <li><router-link to="/login">Entrar</router-link></li>
            </ul>
        </nav>
    </header>
</template>


<style scoped>
    header {
        background-color: #333;
        color: white;
        padding: 1rem;
    }

    .menu {
        display: flex;
        list-style: none;
        gap: 2rem;
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }

        a:hover {
            text-decoration: underline;
        }
</style>
