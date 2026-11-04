<script setup lang="ts">
import { HomeApp } from "@lp/ui";
import manifest from "../page.config.ts";
import catalog from "../catalog.ts";
</script>
<template><HomeApp :manifest="manifest" :catalog="catalog" /></template>
