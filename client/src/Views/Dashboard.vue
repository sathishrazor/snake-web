<template>
    <div class="common-layout">
        <el-container>
            <el-header>Header</el-header>
            <el-main>


                <el-row :gutter="20">
                    <el-col :span="18" :offset="3">

                        <el-row :gutter="20" class="ep-bg-purple">

                            <el-col :span="3">

                                <el-image :src="user.profile_thumb" fit="fill" />

                            </el-col>

                            <el-col :span="18">

                                <el-row>
                                    <el-col :span="24">
                                        <h2 class="m-0">{{ user.username }}
                                            <el-icon>
                                                <Edit />
                                            </el-icon>
                                        </h2>


                                    </el-col>

                                    <el-col :span="24">
                                        <p class="m-0">

                                            <el-icon>
                                                <Message />
                                            </el-icon>

                                            {{ user.email }}
                                        </p>
                                    </el-col>

                                    <el-col :span="24">
                                        <p class="m-0">
                                            <el-icon>
                                                <Monitor />
                                            </el-icon>
                                            {{ user.last_login_device }}
                                        </p>
                                    </el-col>


                                    <el-col :span="24">
                                        <p>Joined:{{ user.date_joined }}</p>
                                    </el-col>

                                </el-row>


                            </el-col>

                            <el-col :span="2">

                                <el-button type="success" @click="$router.push('/newgame')">
                                    New Game
                                </el-button>


                            </el-col>

                            <el-col :span="1">
                                <el-button type="primary" @click="handleAdd">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                            </el-col>

                        </el-row>

                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="18" :offset="3">

                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-statistic title="High Score" :value="user.high_score" />
                                </div>
                            </el-col>

                        </el-row>

                    </el-col>
                </el-row>

            </el-main>
        </el-container>
    </div>

</template>



<style scoped>
.m-0 {
    margin: 0;
}

.p-0 {
    padding: 0;
}

.p-10 {
    padding: 10px;
}

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.el-statistic {
    --el-statistic-content-font-size: 28px;
}

.ep-bg-purple {
    background-color: #deddff;
    border-radius: 4px;
    padding: 20px;
}
</style>


<script>

import { authState } from '../authState';

import moment from 'moment';

export default {
    data() {
        return {
            message: '',
            loading: true,
            user: {}
        };
    },
    async mounted() {
        try {

            this.user = await authState.getUserInfo();

            this.user.date_joined = moment(this.user.date_created).format('MMMM Do YYYY');

            this.loading = false;



        } catch (err) {
            this.message = 'Failed to load dashboard data.';
        }



    }
};
</script>