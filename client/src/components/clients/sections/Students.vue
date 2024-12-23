<template>
    <div class="b-color-0 box-shadow-style mt-5 px-3 py-5 p-md-5">
        <router-view :userType="userType" :offsetNum="offsetNum"></router-view>
    </div>
</template>

<script>
export default {
    props:['userType', 'offsetNum']
}
</script>