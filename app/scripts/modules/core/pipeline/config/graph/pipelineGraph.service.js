'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.core.pipeline.config.graph.pipelineGraph.service', [])
  .factory('pipelineGraphService', function () {

    let xScrollOffset = {};

    function generateExecutionGraph(execution, viewState) {
      let nodes = [];
      (execution.stageSummaries || []).forEach(function(stage, idx) {
        var node = {
          id: stage.refId,
          name: stage.name,
          index: idx,
          parentIds: angular.copy(stage.requisiteStageRefIds || []),
          stage: stage,
          masterStage: stage.masterStage,
          labelTemplateUrl: stage.labelTemplateUrl,
          extraLabelLines: stage.extraLabelLines ? stage.extraLabelLines(stage) : 0,
          parents: [],
          children: [],
          parentLinks: [],
          childLinks: [],
          isActive: viewState.activeStageId === stage.index && viewState.executionId === execution.id,
          isHighlighted: false,
          status: stage.status,
          executionStage: true,
          hasNotStarted: stage.hasNotStarted,
          executionId: execution.id,
        };
        if (!node.parentIds.length) {
          node.root = true;
        }
        nodes.push(node);
      });

      return nodes;
    }

    function generateConfigGraph(pipeline, viewState, pipelineValidations) {
      let nodes = [];
      const configWarnings = pipelineValidations.pipeline;
      var configNode = {
            name: 'Configuration',
            phase: 0,
            id: -1,
            section: 'triggers',
            parentIds: [],
            parents: [],
            children: [],
            parentLinks: [],
            childLinks: [],
            root: true,
            isActive: viewState.section === 'triggers',
            isHighlighted: false,
            warnings: configWarnings.length ? {messages: configWarnings} : null,
            hasWarnings: !!configWarnings.length,
          };
      nodes.push(configNode);

      pipeline.stages.forEach(function(stage, idx) {
        const warnings = pipelineValidations.stages.find(e => e.stage === stage);
        var node = {
          id: stage.refId,
          name: stage.name || '[new stage]',
          section: 'stage',
          index: idx,
          parentIds: angular.copy(stage.requisiteStageRefIds || []),
          parents: [],
          children: [],
          parentLinks: [],
          childLinks: [],
          color: null,
          isActive: viewState.stageIndex === idx && viewState.section === 'stage',
          isHighlighted: false,
          warnings: warnings,
          hasWarnings: !!warnings,
        };
        if (!node.parentIds.length) {
          node.parentIds.push(configNode.id);
        }
        nodes.push(node);
      });

      return nodes;
    }

    return {
      xScrollOffset: xScrollOffset,
      generateExecutionGraph: generateExecutionGraph,
      generateConfigGraph: generateConfigGraph,
    };

  });
