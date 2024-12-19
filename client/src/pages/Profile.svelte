<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import MealPlan from '../components/MealPlan.svelte';

    let { id } = $props();
    let profile = $state(null);

    onMount(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('Users'));
            const response = await axios.get(`http://localhost:8080/users/${id}`, {
                headers: {
                    Authorization: user.header_token // attach token for authorization
                }
            });
            
            console.log('Profile data received:', response.data);
            profile = response.data;
        } catch (error) {
            console.log(error);
        }
    });
</script>

<div class="profile-container">
    {#if !profile}
        <div>Loading User Profile...</div>
    {:else}
        <h1>Welcome, {profile.username}!</h1>
        <p>preferences: {profile.preferences}</p>
        <hr />
        <h2>Meal Plans</h2>
        <div class="mealplan-list">
            {#if profile.mealplans.length === 0}
                <p>No meals in your plan.</p>
            {:else}
                {#each profile.mealplans as mealplan}
                    <div class="mealplan-week">
                        <h3>Week: {mealplan.week}</h3>
                        <div class="mealplan-cards">
                            {#each mealplan.meals as meal}
                                <MealPlan
                                    image={meal.image}
                                    name={meal.name}
                                    diets={meal.diets}
                                />
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .profile-container {
        margin: 2rem auto;
        padding: 2rem;
        text-align: left;
    }

    h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
    }

    h2 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
    }

    .mealplan-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-top: 2rem;
    }

    .mealplan-week {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .mealplan-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
</style>
