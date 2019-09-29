<template>
    <div>
        <div v-for='(item,index) in tableData' :key='index' class='mb-20'>
            <slot :row="item" :$index="index"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tableData: {
            required: true
        }
    }
}
</script>

