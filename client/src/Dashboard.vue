<template>
    <div>
        <h2>Dashboard</h2>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>


export default {
    data() {
        return {
            message: ''
        };
    },
    async mounted() {
        try {
            const response = await fetch('http://localhost:3000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to load dashboard data');
            }
            const data = await response.json();
            this.message = data.message || 'Welcome to your dashboard!';

        } catch (err) {
            this.message = 'Failed to load dashboard data.';
        }
    }
};
</script>