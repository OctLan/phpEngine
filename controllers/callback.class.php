<?php
class callback extends BaseController {
	public function enter(){
		if( v('code') && !$_SESSION['__SINA']['TOKEN'] ){
			$keys = array();
			$keys['code'] = v('code');
			$keys['redirect_uri'] = c('callback');
			if( $token = Weibo::getAccessToken( 'code',$keys ) ){
				$res = Weibo::show_user_by_id( $token['uid'] );
				if( $res && !isset( $res['error_code'] ) ){
					foreach ($res as $key => $value) {
						$_SESSION[$key] = $value;
					}
					$_SESSION['__SINA']['TOKEN'] = $token;
				}else{
					die( 'REST API ERROR!' );
				}
				$_SESSION['expiresTime'] = time() +  $token['remind_in'];
				$_SESSION['__SINA']['TOKEN'] = $token['access_token'];
				$_SESSION['uid'] = $token['uid'] ;
				$uid=$_SESSION['uid'];
				
				
				if( $_SESSION['backUrl'] ){
					if( strpos( $_SESSION['backUrl'] , '?' ) === false ){
						$backUrl = $_SESSION['backUrl'].'?viewer='.$_SESSION['uid'];
					}else{
						$backUrl = $_SESSION['backUrl'].'&viewer='.$_SESSION['uid'];
					}
					header("Location: ".$backUrl );
				}else{
					header('Location: http://'.$_SERVER['HTTP_HOST'].'/');
				}
			}
		}else{
			die( '<div style="padding:20px;text-aligin:center">只有授权后才能进入应用 </div>' );
		}
	}
}