<?php
//ini_set('display_startup_errors',1);
//ini_set('display_errors',1);
//error_reporting(-1);

// enqueue the child theme stylesheet 

Function wp_schools_enqueue_scripts() {
wp_register_style( 'childstyle', get_stylesheet_directory_uri() . '/style.css'  );
wp_enqueue_style( 'childstyle' );
}
add_action( 'wp_enqueue_scripts', 'wp_schools_enqueue_scripts', 11);

function curl_download($Url){
    // is cURL installed yet?
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
    // OK cool - then let's create a new cURL resource handle
    $ch = curl_init();
    // ###Now set some options (most are optional)###
    // Set URL to download
    curl_setopt($ch, CURLOPT_URL, $Url);
    // Set a referer
    curl_setopt($ch, CURLOPT_REFERER, "http://www.example.org/yay.htm");
    // User agent
    curl_setopt($ch, CURLOPT_USERAGENT, "MozillaXYZ/1.0");
    // Include header in result? (0 = yes, 1 = no)
    curl_setopt($ch, CURLOPT_HEADER, 0);
    // Should cURL return or print out the data? (true = return, false = print)
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Timeout in seconds
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    // Download the given URL, and return output
    $output = curl_exec($ch);
    // Close the cURL resource, and free system resources
    curl_close($ch);
    return $output;
}

function getQuote( $url, $string ){
  require_once('simple_html_dom.php');
  $curl = curl_download($url);
  $html = str_get_html($curl);
  $all = $html->find('.yfi_rt_quote_summary_rt_top'); //Gets just the quote info ($all is for 'all' the quote info)

  $all = $all[0];

  //Get each # seperately:
  $price = $all->find("[id^=yfs_l10_$string]");
  $change = $all->find("[id^=yfs_c10_$string]");
  $percentChange = $all->find("[id^=yfs_p20_$string]");
  $date = $html->find('[id=yfs_market_time]');
  
  //Remove HTML:
  $price = $price[0]->innertext;
  $change = $change[0]->innertext;
  $percentChange = $percentChange[0]->innertext;
  $change = preg_replace('/^.*?>\s*/','', $change);  //Removes the updown image
  $date = $date[0]->innertext;  
  $date = preg_replace('/EST.*/','EST', $date);  //Removes the updown image

  return array($price, $date, $change, $percentChange);
  //return array($price, $date);
}
//[quote3]
function quote3_func( $atts ){
  //Start Function:
  //list ( $price, $date, $change, $percentChange) = getQuote('http://finance.yahoo.com/q?s=GAVIX','gavix');

  return '
            <span style="color: #000000;">Net Asset Value: $ from BNY basket feed</span>
            <span style="color: #000000;"> Daily Change: $ from BNY basket feed</span>
            <span style="color: #000000;"> Daily Change (%): % from BNY basket feed</span>
            <span style="color: #000000;"> YTD NAV: $ from BNY basket feed</span>
            <span style="color: #000000;"> YTD Change (%): % from BNY basket feed</span>
        ';
}

add_shortcode( 'quote3', 'quote3_func' );


//[quote]
function quote_func( $atts ){
// No Longer using attributes
//  $a = shortcode_atts( array(
//        'url' => false
//    ), $atts );
//  if( ! $a['url'] ) return;//make sure we have the url attribute / parameter otherwise return.

  //Start Function:

  list ( $price, $date) = getQuote("http://finance.yahoo.com/q?s=IE00B1DS1042.IR",'ie00b1ds1042' );

  return "<strong>Bloomberg: GAVPLAT $price</strong></strong><br /><em>$date</em><br />";
}

add_shortcode( 'quote', 'quote_func' );

//[quote2]
function quote2_func( $atts ){
  //Start Function:
  list ( $price, $date) = getQuote('http://finance.yahoo.com/q?s=GAVAX','gavax');
  list ( $price2, $date2) = getQuote('http://finance.yahoo.com/q?s=GAVIX','gavix');

  return '<p style="text-align: center;"><span style="color: #ededed;"><strong>GAVAX (A-share) ' . $price . '</strong><br /><strong>GAVIX (I-share) ' . $price2 . '</strong><br /><em>' . $date . '</em><br />';
}

add_shortcode( 'quote2', 'quote2_func' );

add_filter( 'walker_nav_menu_start_el', 'gt_add_menu_item_description', 10, 4); 
function gt_add_menu_item_description( $item_output, $item, $depth, $args ) {
    $output = preg_replace('/(<a href="http:\/\/www.gavekalfunds.com.*?" )/', '$1' . ' onClick="return alert(\'You are about to leave the Gavekal Capital site and are being redirected to the url GavekalFunds.com\')" target="_top" ', $item_output); 
    if(preg_match('/target="_top"/', $output)){
       return $output;
    }
    return preg_replace('/(<a href="http:\/\/.*?" )/', '$1' . ' target="_top" ', $item_output); 
}

//[chart]
function chart_func( $atts ){
  $a = shortcode_atts( array(
        'type' => false
    ), $atts );
  //if( ! $a['type'] ) return;//make sure we have the type attribute / parameter otherwise return.
  
  $type = $a['type'];

  //Start Function:
  //return "<iframe src='http://www.jp.shwaydogg.net/gkc/?$type' style='border:none;width:615px; height:491px; padding:20px; background-color:white; margin:auto; display:block;'></iframe>";
  return "<iframe src='http://www.gavekalcapital.com/wp-content/themes/stardustwp-child/gkc/?$type' style='border:none;width:100%; height:491px; padding:20px; background-color:white; margin:auto; display:block;'></iframe>";
}

add_shortcode( 'chart', 'chart_func' );

//if(is_home()) {
  add_action('wp_enqueue_scripts', 'load_javascript_files');
  function load_javascript_files() {
    wp_register_script('speedBump', get_stylesheet_directory_uri() . '/speedBump.js', array('jquery'), true );
    wp_enqueue_script('speedBump', get_stylesheet_directory_uri() . '/speedBump.js', array('jquery'), true );
  }
//}
