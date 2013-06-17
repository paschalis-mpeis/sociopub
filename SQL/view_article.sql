-- --------------------------------------------------------------------------------
-- Routine DDL
-- Note: comments before and after the routine body will not be stored by the server
-- --------------------------------------------------------------------------------
DELIMITER $$

CREATE DEFINER=`paschal_sp`@`%` PROCEDURE `view_article`(
article_id INT(10),
username VARCHAR(30)
)
BEGIN

-- RETURN CODES:
--  RESULT  1: Successfully viewed
--  RESULT -1: USER DOESNT EXISTS
--  RESULT -2: article NOT exists
--  RESULT -3: User_article NOT exists
-- IF >0 TOTAL LIKES WILL RETURNED TOO!


	-- Variables
	DECLARE articleID, userID, userArticleID INT(10) DEFAULT -1;
	DECLARE currentLikeValue BIT DEFAULT 0;

	-- Get userID
	SELECT U.idUSER INTO userID  
	FROM USER U
	WHERE U.USERNAME=username;

	-- user doesnt exists
	IF (userID<0) THEN
		SELECT -1 AS RESULT;
	END IF;

	-- get articleID if exists
	SELECT A.idARTICLE INTO articleID
	FROM ARTICLE A
	WHERE A.idARTICLE=article_id;

	-- dont exists. add to DB
	 IF (articleID<0) THEN
		SELECT -2 AS RESULT;
	END IF;

	-- get userArticleID
	SELECT UA.idUSER_ARTICLE INTO userArticleID
	FROM USER_ARTICLE UA
	WHERE UA.idArticle=articleID && UA.idUSER=userID;

	if(userArticleID<0) THEN
		SELECT -3 AS RESULT;
	END IF;

	SELECT UA.LIKED INTO currentLikeValue
	FROM USER_ARTICLE UA
	WHERE UA.idArticle=articleID && UA.idUSER=userID;

		UPDATE USER_ARTICLE SET VIEWED=1 WHERE idUSER_ARTICLE=userArticleID; 
		SELECT 1 AS RESULT, 
		(
		SELECT COUNT(*)
		FROM USER_ARTICLE UA
		WHERE UA.idARTICLE=articleID AND UA.VIEWED=1
		) AS VIEWS
		;

END