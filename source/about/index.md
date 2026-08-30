---
title: 个人简介
date: 2026-08-30 12:00:00
type: about
---

<div class="lz-sf">

<div class="lz-sf-hero">
  <div class="lz-sf-corner tl"></div>
  <div class="lz-sf-corner br"></div>
  <div class="lz-sf-hero-l">
    <p class="lz-sf-eyebrow">个人档案 · LGQ-2026</p>
    <h1 class="lz-sf-name">刘国庆</h1>
    <p class="lz-sf-role"><span class="lz-sf-dot"></span>AI 应用开发工程师 · 在线</p>
  </div>
  <div class="lz-sf-hero-r">
    <div><span class="k">意向职位</span><span class="v">AI 应用开发（Agent / RAG）</span></div>
    <div><span class="k">工作年限</span><span class="v">1 年</span></div>
    <div><span class="k">研究方向</span><span class="v">Agent · RAG · 多智能体协同</span></div>
  </div>
</div>

<h2 class="lz-h">技术栈</h2>

<div class="lz-sf-module">
  <p class="lz-sf-mod">模块 01 · 深度学习与 NLP 模型开发</p>
  <div class="lz-chips">
    <span>PyTorch</span><span>Transformer</span><span>BERT</span><span>迁移学习</span><span>LoRA / QLoRA 轻量化微调</span><span>文本清洗与数据去重</span><span>标签体系搭建</span><span>模型评估（准确率 / 召回率 / F1）</span>
  </div>
</div>

<div class="lz-sf-module">
  <p class="lz-sf-mod">模块 02 · 大模型与 Agent 应用开发</p>
  <div class="lz-chips">
    <span>Coze</span><span>Dify</span><span>提示词工程</span><span>Function Calling</span><span>ReAct</span><span>LangChain</span><span>LangGraph</span><span>LlamaIndex</span><span>LangSmith</span><span>Langfuse</span><span>MCP / A2A 协议</span><span>多智能体协同</span>
  </div>
</div>

<div class="lz-sf-module">
  <p class="lz-sf-mod">模块 03 · 编程语言与数据库</p>
  <div class="lz-chips">
    <span>Python</span><span>FastAPI</span><span>Flask</span><span>Streamlit</span><span>MySQL</span><span>NumPy</span><span>Pandas</span><span>Matplotlib</span><span>Claude Code</span><span>Codex</span>
  </div>
</div>

<h2 class="lz-h">工作经历</h2>

<ul class="lz-timeline">
  <li>
    <span class="lz-date">2025-09 ~ 2026-06 · 山西仰星科技有限公司 · AI 开发工程师</span>
    <p>参与智慧教研平台「AI 智能录入」子模块开发：负责 BERT 多任务模型的训练与推理优化、语料清洗与标签体系设计，单题录入时间由分钟级降至秒级；与 4 人团队协同完成接口联调与模型上线，参与需求评审与模型效果迭代。</p>
  </li>
</ul>

<h2 class="lz-h">项目经历</h2>

<div class="lz-sf-mission">
  <p class="lz-sf-mission-tag">项目 01</p>
  <h3>智慧教研平台 — AI 智能试题录入系统</h3>
  <p class="lz-sf-pbg"><b>项目背景：</b>平台面向全市中小学校，是题库自动化建设项目。客户反馈人工录题慢，一道题从输入到标注要几分钟；更麻烦的是标注口径不统一，不同老师对学科、题型、知识点的理解不一样，标出来的结果很乱，后续智能组卷和学情分析根本用不上。项目立项做 AI 自动录入，把标注标准化、自动化。</p>
  <ul>
    <li><b>数据与标签体系：</b>清洗、去重并规范化历史录题语料 3.2 万余条，搭建「12 学科 / 8 题型 / 320+ 知识点」三级标签体系与统一标注规范，双人交叉标注一致率由 82% 提升至 95%。</li>
    <li><b>多任务模型训练：</b>基于 bert-base-chinese 构建共享主干 + 3 分类头架构，并行预测学科 / 题型 / 知识点，加权联合损失缓解任务冲突；5000 条人工复核测试集上三级联合准确率 89.8%，知识点 F1 较单任务基线提升 6.2pt。</li>
    <li><b>题目查重：</b>基于 SimHash 计算 64 位文本指纹，以海明距离阈值 3 判定近似重复，题库重复率由约 6% 降至 0.5% 以内，累计拦截重复、相似题目 2000+ 条。</li>
    <li><b>推理优化与联调：</b>模型导出 ONNX 并引入动态 batch 推理，单题 P95 耗时由 216ms 降至 125ms（降低 42%）；GPU/CPU 自动适配，经 100 并发压测稳定运行，支撑全市无 GPU 环境学校灵活部署。</li>
  </ul>
  <div class="lz-result">
    <b>项目成果：</b>单题录入由 3~5 分钟压缩至 10 秒内，录题效率提升 95% 以上；上线 3 个月累计自动录入试题 2.4 万余道，覆盖全市 60 余所学校；修正样本按周回流再训练，学科分类准确率由 96.5% 迭代至 98.94%，标准化标签直接支撑智能组卷与学情分析上线。
  </div>
</div>

<div class="lz-sf-mission">
  <p class="lz-sf-mission-tag">项目 02</p>
  <h3>智能工单系统</h3>
  <p class="lz-sf-pbg"><b>项目背景：</b>公司客服团队新人培训周期长，老客服回答口径不统一、响应不及时，客户等待时间长。项目搭建智能工单系统，接入公司内部知识库，让 AI 根据客户问题自动生成规范答复。</p>
  <ul>
    <li><b>流程编排：</b>基于 Dify 搭建「意图识别 → 优先级判断 → RAG 检索 → 自动回复 → 人工兜底」全链路工作流，覆盖 6 类工单意图、3 级优先级，意图识别准确率 95%，优先级判定与人工一致率 92%。</li>
    <li><b>RAG 知识库建设：</b>清洗并切分公司内部文档 200+ 篇为 3000+ 语义分段，调优检索策略（top-5 召回、相似度阈值 0.7），检索命中率由 78% 提升至 91%，回复自动附带知识库来源引用。</li>
    <li><b>提示词工程与数据管理：</b>以提示词约束答复口径与拒答边界，检索无命中自动转人工，常见问题自动应答覆盖率 60%+；设计 MySQL 工单、会话、命中日志表结构，支撑答复质量抽检与 bad case 回流。</li>
    <li><b>效果评估与迭代：</b>人工评审 500+ 条生成答复并做 bad case 归因，按周迭代知识库与提示词，客服回复准确率由 85% 提升至 93%；新客服培训周期由 4 周缩短至 2 周，答复口径全面对齐知识库标准。</li>
  </ul>
  <div class="lz-result">
    <b>项目成果：</b>客服回复准确率提升至 93%，平均响应时长由 10 分钟级缩短至 30 秒内；约 60% 的常见问题工单无需人工介入自动解决，人工工单处理量下降约 40%；新客服培训周期由 4 周缩短至 2 周。
  </div>
</div>

<h2 class="lz-h">自我评价</h2>

<div class="lz-sf-mission">
  <ul>
    <li><b>开发经验：</b>一年 AI 开发经验，完整参与过一个上线项目从模型训练到部署的全流程。</li>
    <li><b>做事风格：</b>习惯先把需求拆清楚再动手，遇到问题倾向查文档、读源码自己解决。</li>
    <li><b>持续学习：</b>业余持续跟进 Agent 应用开发，用 Dify 做过个人项目练手。</li>
    <li><b>职业目标：</b>期待在 AI 应用开发方向长期深耕。</li>
  </ul>
</div>

</div>
