{
	("use strict");

	const titleClickHandler = function (event) {
		event.preventDefault();
		const clickedElement = this;

		/* [DONE] remove class 'active' from all article links  */

		const activeLinks = document.querySelectorAll(".titles a.active");

		for (let activeLink of activeLinks) {
			activeLink.classList.remove("active");
		}

		/* [DONE] add class 'active' to the clicked link */

		clickedElement.classList.add("active");

		/* [DONE] remove class 'active' from all articles */

		const activeArticles = document.querySelectorAll(".posts .post.active");

		for (let activeArticle of activeArticles) {
			activeArticle.classList.remove("active");
		}

		/* get 'href' attribute from the clicked link */

		const articleSelektor = clickedElement.getAttribute("href");

		/* find the correct article using the selector (value of 'href' attribute) */

		const targetArticle = document.querySelector(articleSelektor);

		/* add class 'active' to the correct article */

		targetArticle.classList.add("active");
	};

	const optArticleSelector = ".post",
		optTitleSelector = ".post-title",
		optTitleListSelector = ".titles",
		optArticleTagsSelector = ".post-tags .list",
		optArticleAuthorSelector = ".post-author",
		optAuthorsListSelector = 1,
		optTagsListSelector = ".tags.list", // dlaczego zapisane są razem?
		optCloudClassCount = 5,
		optCloudClassPrefix = "tag-size-";

	function generateTitleLinks(customSelector = "") {
		/* remove contents of titleList */
		const titleList = document.querySelector(optTitleListSelector);
		function clearMessages() {
			titleList.innerHTML = "";
		}
		clearMessages();
		/* for each article */
		const articles = document.querySelectorAll(
			optArticleSelector + customSelector
		);
		for (const article of articles) {
			/* get the article id */
			const articleId = article.getAttribute("id");

			/* find the title element */

			const articleTitle = article.querySelector(optTitleSelector).innerHTML;

			/* get the title from the title element */

			/* create HTML of the link */

			const linkHTML =
				'<li><a href="#' +
				articleId +
				'"><span>' +
				articleTitle +
				"</span></a></li>";

			/* insert link into titleList */

			titleList.innerHTML = titleList.innerHTML + linkHTML;

			const links = document.querySelectorAll(".titles a");

			for (let link of links) {
				link.addEventListener("click", titleClickHandler);
			}
		}
	}

	generateTitleLinks();

	function calculateTagsParams(tags) {
		const params = { max: 0, min: 999999 };
		for (let tag in tags) {
			if (tags[tag] > params.max) {
				params.max = tags[tag];
			}
			if (tags[tag] < params.min) {
				params.min = tags[tag];
			}
		}
		return params;
	}

	function calculateTagClass(count, params) {
		const normalizedCount = count - params.min;
		const normalizedMax = params.max - params.min;
		const percentage = normalizedCount / normalizedMax;
		const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
		return optCloudClassPrefix + classNumber;
	}

	function generateTags() {
		/* [NEW] create a new variable allTags with an empty array */
		let allTags = {};
		/* find all articles */
		const articles = document.querySelectorAll(optArticleSelector);
		/* START LOOP: for every article: */
		for (const article of articles) {
			/* find tags wrapper */
			const titleList = article.querySelector(optArticleTagsSelector);
			/* make html variable with empty string */
			let html = "";
			/* get tags from data-tags attribute */
			const articleTags = article.getAttribute("data-tags");
			/* split tags into array */
			const articleTagsArray = articleTags.split(" ");

			/* START LOOP: for each tag */
			for (let tag of articleTagsArray) {
				/* generate HTML of the link */
				const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + "</a></li>";
				/* add generated code to html variable */
				html += " " + linkHTML;
				/* [NEW] check if this link is NOT already in allTags */
				if (!allTags[tag]) {
					/* [NEW] add tag to allTags object */
					allTags[tag] = 1;
				} else {
					allTags[tag]++;
				}
				/* END LOOP: for each tag */
			}
			/* [NEW] find list of tags in right column */
			const tagList = document.querySelector(optTagsListSelector);

			/* [NEW] create variable for all links HTML code */
			const tagsParams = calculateTagsParams(allTags);
			let allTagsHTML = "";

			console.log(tagsParams);
			/* [NEW] START LOOP: for each tag in allTags: */
			for (let tag in allTags) {
				/* [NEW] generate code of a link and add it to allTagsHTML */
				allTagsHTML +=
					'<a href="#tag-' +
					tag +
					'" class="' +
					calculateTagClass(allTags[tag], tagsParams) +
					'">' +
					tag +
					" " + // po co mi potrzebna ta spacja? bez niej wszystkie tagi ustawiwają się obok siebie
					"</a>";
			}
			/* [NEW] END LOOP: for each tag in allTags: */

			/*[NEW] add HTML from allTagsHTML to tagList */
			tagList.innerHTML = allTagsHTML;
			/* insert HTML of all the links into the tags wrapper */

			titleList.innerHTML = html;
			/* END LOOP: for every article: */
		}
	}

	generateTags();

	function tagClickHandler(event) {
		/* prevent default action for this event */
		event.preventDefault();

		/* make new constant named "clickedElement" and give it the value of "this" */
		const clickedElement = this;

		/* make a new constant "href" and read the attribute "href" of the clicked element */
		const href = clickedElement.getAttribute("href");

		/* make a new constant "tag" and extract tag from the "href" constant */
		const tag = href.split("-")[1];
		//const tag = href.replace('#tag-', '');

		/* find all tag links with class active */
		const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

		/* START LOOP: for each active tag link */
		for (const activeTagLink of activeTagLinks) {
			/* remove class active */
			activeTagLink.classList.remove("active");
			/* END LOOP: for each active tag link */
		}

		/* find all tag links with "href" attribute equal to the "href" constant */
		const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

		/* START LOOP: for each found tag link */
		for (const tagLink of tagLinks) {
			/* add class active */
			tagLink.classList.add("active");

			/* END LOOP: for each found tag link */
		}

		/* execute function "generateTitleLinks" with article selector as argument */
		generateTitleLinks('[data-tags~="' + tag + '"]');
	}

	function addClickListenersToTags() {
		/* find all links to tags */
		const tagLinks = document.querySelectorAll(".post-tags a");
		// add constant that's value is tags from tags cloud
		const tagCloudLinks = document.querySelectorAll(".tags.list a");
		// combine both tagLinks and tagCloudLinks into one array
		const allTagLinks = [...tagLinks, ...tagCloudLinks];
		/* START LOOP: for each link */
		for (const tagLink of allTagLinks) {
			/* add tagClickHandler as event listener for that link */
			tagLink.addEventListener("click", tagClickHandler);
			/* END LOOP: for each link */
		}
	}

	addClickListenersToTags(); //Dlaczego tu to działa 255

	function authorClickHandler(event) {
		/* prevent default action for this event */
		event.preventDefault();

		/* make new constant named "clickedElement" and give it the value of "this" */
		const clickedElement = this;

		/* make a new constant "href" and read the attribute "href" of the clicked element */
		const href = clickedElement.getAttribute("href");

		/* make a new constant "author" and extract author from the "href" constant */
		const author = href.split("-")[1];

		/* find all author links with class active */
		const activeAuthorLinks = document.querySelectorAll(
			'a.active[href^="#author-"]'
		);

		/* START LOOP: for each active author link */
		for (const activeAuthorLink of activeAuthorLinks) {
			/* remove class active */
			activeAuthorLink.classList.remove("active");
			/* END LOOP: for each active author link */
		}

		/* find all author links with "href" attribute equal to the "href" constant */
		const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

		/* START LOOP: for each found author link */
		for (const authorLink of authorLinks) {
			/* add class active */
			authorLink.classList.add("active");

			/* END LOOP: for each found author link */
		}

		/* execute function "generateTitleLinks" with article selector as argument */
		generateTitleLinks('[data-author="' + author + '"]');
	}

	function addClickListenersToAuthors() {
		/* find all links to authors */
		const authorLinks = document.querySelectorAll(".post-author a");
		/* START LOOP: for each link */
		for (const authorLink of authorLinks) {
			/* add authorClickHandler as event listener for that link */
			authorLink.addEventListener("click", authorClickHandler);
			/* END LOOP: for each link */
		}
	}
	// addClickListenersToAuthors(); A tu już to nie działa

	function generateAuthors() {
		/* find all articles */
		const articles = document.querySelectorAll(optArticleSelector);
		/* START LOOP: for every article: */
		for (const article of articles) {
			/* find authorss wrapper */
			const titleList = article.querySelector(optArticleAuthorSelector);
			/* make html variable with empty string */
			let html = "";
			/* get authors from data-authors attribute */
			const articleAuthor = article.getAttribute("data-author");
			/* generate HTML of the link */
			const linkHTML =
				'<a href="#author-' + articleAuthor + '">' + articleAuthor + "</a>";
			/* add generated code to html variable */
			html += linkHTML;
			/* insert HTML of all the links into the authors wrapper */
			titleList.innerHTML = html;
			/* END LOOP: for every article: */
		}
		addClickListenersToAuthors(); //Dlaczego musiałem przenieść tą funkcję tutaj???
	}

	generateAuthors();
}
