# Aleksei Kokorev · Python Backend Engineer

My portfolio covers Python APIs, event-driven services, and production ML inference.

**[View portfolio](https://alex-coch.github.io/)** · [View resume](https://alex-coch.github.io/resume/)

## Case studies

- [Matching audiobook narration to text](https://alex-coch.github.io/projects/audiobook-alignment/) — An Airflow pipeline and a production GPU inference service that align audiobook narration with ebook passages. · [View audio example](https://alex-coch.github.io/projects/audiobook-alignment/#alignment-example)
- [Reliable event delivery for document workflows](https://alex-coch.github.io/projects/transactional-outbox/) — A PostgreSQL transactional outbox and idempotent RabbitMQ consumers that handle broker outages and prevent duplicate updates on redelivery. · [View failure test results](https://alex-coch.github.io/projects/transactional-outbox/#failure-test-results) · [Run the demo](https://github.com/alex-coch/document-events-outbox#quick-start)
  [![Docker Compose](https://github.com/alex-coch/document-events-outbox/actions/workflows/compose-ci.yml/badge.svg?branch=main)](https://github.com/alex-coch/document-events-outbox/actions/workflows/compose-ci.yml) [![Kubernetes (kind)](https://github.com/alex-coch/document-events-outbox/actions/workflows/kind-ci.yml/badge.svg?branch=main)](https://github.com/alex-coch/document-events-outbox/actions/workflows/kind-ci.yml)
- [What’s new in this article?](https://alex-coch.github.io/projects/article-comparison/) — A Chrome extension and Python API that use ChromaDB to compare an article with earlier reading and show what’s new. · [View example comparison](https://alex-coch.github.io/projects/article-comparison/#example-comparison)
- [Blockchain Address Screening](https://alex-coch.github.io/projects/blockchain-address-screening/) — A Python service that screens blockchain addresses using external risk and financial data providers and lets compliance teams review past checks. · [View screening example](https://alex-coch.github.io/projects/blockchain-address-screening/#screening-example)

## Local preview

With [Jekyll’s prerequisites](https://jekyllrb.com/docs/installation/) and Bundler installed, run these commands from the repository root:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open [http://127.0.0.1:4000/](http://127.0.0.1:4000/). Jekyll builds the ML archive along with the portfolio.

## Machine Learning Archive

[Explore earlier projects](https://alex-coch.github.io/learning/ml/) in machine learning, computer vision, and natural language processing.
