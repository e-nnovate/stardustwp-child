<?php
/*
* Template Name: BLOG Header Footer
* */
get_header();
?>
<style>
header {
  display:none;
}
html, body, main{
  background: black;  
}
</style>
<script type="text/javascript">
jQuery(document).ready(function(){
  jQuery('*').attr('target','_top');
});
</script>
<?php get_footer(); ?>
