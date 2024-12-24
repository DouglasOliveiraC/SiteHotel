<!-- src/components/FeatureCard.vue -->
<template>
    <div class="feature-card">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
    </div>
</template>

<script>
    export default {
        name: 'FeatureCard',
        props: {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    };
</script>

<style scoped>
    .feature-card {
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .feature-card h3 {
            margin-bottom: 1rem;
            color: #007bff;
        }

        .feature-card p {
            color: #555;
        }
</style>
