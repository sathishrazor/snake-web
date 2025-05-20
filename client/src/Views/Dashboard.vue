<template>
    <div aria-label="A complete example of page header">
        <el-page-header @back="onBack">
            <template #breadcrumb>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">
                        Home
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <a href="/dashboard">Dashboard</a>
                    </el-breadcrumb-item>

                </el-breadcrumb>
            </template>
            <template #content>
                <div class="flex items-center">
                    <el-avatar class="mr-3" :size="32"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <span class="text-large font-600 mr-3"> Welcome </span>
                    <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                        Sathish
                    </span>
                    <el-tag type="success">Online</el-tag>
                </div>
            </template>

            <template #extra>
                <div class="flex items-center">
                    <el-button>Play</el-button>
                    <el-button type="primary" class="ml-2">New Match</el-button>
                </div>
            </template>

            <el-row :gutter="16">
                <el-col :span="8">
                    <div class="statistic-card">
                        <el-statistic :value="98500">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    Top Score

                                </div>
                            </template>
                        </el-statistic>
                        <div class="statistic-footer">
                            <div class="footer-item">
                                <span>than yesterday</span>
                                <span class="green">
                                    24%
                                    <el-icon>
                                        <CaretTop />
                                    </el-icon>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card">
                        <el-statistic :value="693700">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    Total Matches
                                </div>
                            </template>
                        </el-statistic>
                        <div class="statistic-footer">
                            <div class="footer-item">
                                <span>month on month</span>
                                <span class="red">
                                    12%
                                    <el-icon>
                                        <CaretBottom />
                                    </el-icon>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card">
                        <el-statistic :value="72000" title="New transactions today">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    No of Followers
                                </div>
                            </template>
                        </el-statistic>
                        <div class="statistic-footer">
                            <div class="footer-item">
                                <span>than yesterday</span>
                                <span class="green">
                                    16%
                                    <el-icon>
                                        <CaretTop />
                                    </el-icon>
                                </span>
                            </div>
                            <div class="footer-item">
                                <el-icon :size="14">
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>



        </el-page-header>
    </div>

</template>



<style scoped>
.el-statistic {
    --el-statistic-content-font-size: 28px;
}

.statistic-card {
    height: 100%;
    padding: 20px;
    border-radius: 4px;
    background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    color: var(--el-text-color-regular);
    margin-top: 16px;
}

.statistic-footer .footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.statistic-footer .footer-item span:last-child {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
}

.green {
    color: var(--el-color-success);
}

.red {
    color: var(--el-color-error);
}
</style>


<script>
import { fetchWithAuth } from '../fetchWithAuth.js';
import {
    ArrowRight,
    CaretBottom,
    CaretTop,
    Warning,
} from '@element-plus/icons-vue'

export default {
    data() {
        return {
            message: ''
        };
    },
    async mounted() {
        try {
            const response = await fetchWithAuth('http://localhost:3000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to load dashboard data');
            }
            const data = await response.json();

            console.log("data", data);

            this.message = data.message || 'Welcome to your dashboard!';



        } catch (err) {
            this.message = 'Failed to load dashboard data.';
        }



    }
};
</script>