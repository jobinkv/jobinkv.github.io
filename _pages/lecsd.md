---
title: 'Semantic Labels-Aware Transformer Model for Searching over a Large Collection of Lecture-Slides'
date: 2024-01-01
permalink: /lecsd/
bibliography: references.bib
tags:
  - WACV
  - retrieval
  - Slide images
---

<!-- This repository provides the official blog of the paper: -->
> **Semantic Labels-Aware Transformer Model for Searching over a Large Collection of Lecture-Slides** <br>
> K. V. Jobin, Anand Mishra, and C. V. Jawahar<br>
> In WACV 2024<br>

|[LecSD](https://github.com/jobinkv/LecSD){: .btn}|[Pdf](https://openaccess.thecvf.com/content/WACV2024/papers/Jobin_Semantic_Labels-Aware_Transformer_Model_for_Searching_Over_a_Large_Collection_WACV_2024_paper.pdf){: .btn}| [Supp](https://openaccess.thecvf.com/content/WACV2024/supplemental/Jobin_Semantic_Labels-Aware_Transformer_WACV_2024_supplemental.pdf){: .btn}|



### Please cite
```
@InProceedings{Jobin_2024_WACV,
    author    = {Jobin, K. V. and Mishra, Anand and Jawahar, C. V.},
    title     = {Semantic Labels-Aware Transformer Model for Searching Over a Large Collection of Lecture-Slides},
    booktitle = {Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)},
    month     = {January},
    year      = {2024},
    pages     = {6016-6025}
}
```

> **Abstract:** *Massive Open Online Courses(MOOCs) enable easy access to many educational materials, particularly lecture slides, on the web. Searching through them based on user queries becomes an essential problem due to the availability of such vast information.
To address this, we present Lecture Slide Deck Search Engine (LecDeckSearch Engine) -- a search engine that supports natural language queries and hand-drawn sketches and performs searches on a large collection of slide images on computer science topics. 
This search engine is trained using a novel semantic label-aware transformer model that extracts the semantic labels in the slide images and seamlessly encodes them with the visual cues from the slide images and textual cues from the natural language query. 
Further, to study the problem in a challenging setting, we introduce a novel dataset, namely the Lecture Slide Deck (LecSD) Dataset containing $54K$ slide images from the Data Structure, computer networks, and optimization courses and provide associated manual annotation for the query in the form of natural language or hand-drawn sketch.
The proposed LecDeckSearch Engine outperforms the competitive baselines and achieves nearly $4\%$ superior Recall@1 compared to the state-of-the-art approach. We firmly believe that this work will open up promising directions for improving the accessibility and usability of educational resources, enabling students and educators to find and utilize lecture materials more effectively. We shall make our code and dataset publicly available upon acceptance of this work.*<br>

