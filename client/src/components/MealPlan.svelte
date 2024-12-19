<script>
    export let image = '';
    export let name = '';
    export let diets = [];
</script>

<div class="mealplan-card">
    <img class="mealplan-image" src={image} alt={name} />
    <div class="mealplan-info">
        <p class="mealplan-name">{name}</p>
        <p class="mealplan-diets">{diets}</p>

    </div>
</div>

<style>
    .mealplan-card {
        background-color: #1d2531;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        max-width: 250px;
        transition: transform 0.2s ease-in-out;
    }

    .mealplan-card:hover {
        transform: scale(1.05);
    }

    .mealplan-image {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        object-fit: cover;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .mealplan-info {
        text-align: center;
    }

    .mealplan-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    .mealplan-diets{
        color: #a8b9b7;
        margin: 0.3rem 0;
    }

</style>