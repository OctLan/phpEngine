<?php
function checkLogin(){
	if( !isLogin() ){
		$back = $_SERVER['REQUEST_URI']?:'/';
		if( v('ajax') && isset( $_SERVER['HTTP_REFERER'])&&$_SERVER['HTTP_REFERER'] ){
			$back = $_SERVER['HTTP_REFERER'];
		}
		$state = NULL;
		if( IFCookie::isNeedFix()  ){
			$sid = session_id();
			$state = $sid;
			$back .= '&'.IFCookie::SESSIONSTR.'='.$sid;
		}
		$_SESSION['backUrl'] = $back;
		$aurl = Weibo::getAuthorizeURL( c('callback') , 'code' , $state );
		header("Location: ".$aurl);
		exit;
	}
}
function isLogin(){
	if( isset( $_GET['viewer'] ) ){
		if( $_GET['viewer'] == '' || $_GET['viewer'] != $_SESSION['id'] ){
			$_SESSION = array();
		}
	}
	if( $_SESSION['id'] ){
		return true;
	}else{
		return false;
	}
}
function getPager( $page , $page_all , $old = array() ,$custom  = array() ){
	if( $page_all <= 1 ){
		return '';
	}
	if( $custom && is_array($custom) ){
		$custom = '&'.http_build_query($custom);
	}elseif( $custom ){
		$custom = '&'.$custom;
	}else{
		$custom = NULL;
	}
	$pre = $next = $middle = '';
	$left_num = $right_num = 0;
	$left_more = $right_more = false;
	if( $page > 1 ){
		$pre = '<li class="pref" ><a href="'.Url::make( 'page='.($page - 1).$custom  , $old ).'" title="上一页">上一页</a></li>';
	}
	if( $page < $page_all ){
		$next = '<li class="next" ><a href="'.Url::make( 'page='.($page + 1).$custom  , $old ). '"  title="下一页">下一页</a></li>';
	}
	if( $page_all <= 11 ){
		/* 小于等于 11 页 */
		$left_num = $page - 1;
		$right_num = $page_all - $page;
	}else{
		if( $page > 6 ){
			$left_more = true;
			if( $page < $page_all - 5 ){
				$right_more = true;
				$left_num = 4;
				$right_num = 4;
			}else{
				$right_more = false;
				$right_num = $page_all - $page;
				$left_num = 9 - $right_num;
			}
		}else{
			$left_num = $page - 1;
			$left_more = false;
			$right_num = 9 - $left_num;
			$right_more = true;
		}
	}
	if( $left_more ){
		$middle .= '<li><a href="'.Url::make( 'page=1'.$custom , $old ).'">1</a></li>';
		$middle .= '<li><a>...</a></li>';
	}
	for($j=$left_num;$j>0;$j--){
		$i = $page - $j;
		if( $i <= 0 ){
			continue;
		}
		$middle .= '<li><a href="'.Url::make( 'page='.$i.$custom , $old ). '">' . $i .'</a></li>';
	}
	$middle .= '<li class="cur"><a>' . $page . '</a></li>';
	for($j=1;$j<=$right_num;$j++){
		$i = $page + $j;
		if( $i > $page_all ){
			continue;
		}
		$middle .= '<li><a href="'.Url::make( 'page='.$i.$custom , $old ).'">' . $i .'</a></li>';
	}
	if( $right_more ){
		$middle .= '<li><a>...</a></li>';
		$middle .= '<li><a href="'.Url::make( 'page='.$page_all.$custom  , $old ).'">' . $page_all .'</a></li>';
	}
	return $pre.$middle.$next;
}