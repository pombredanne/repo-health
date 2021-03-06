"""
GhPullRequestHistory.py - (C) Copyright - 2017
This software is copyrighted to contributors listed in CONTRIBUTIONS.md.

SPDX-License-Identifier: MIT

Author(s) of this file:
  J. Harding
  
GitHub pull request history.
"""

from django.db import models


class GhPullRequestHistory(models.Model):
    OPENED_ACTION = 'opened'
    CLOSED_ACTION = 'closed'
    MERGED_ACTION = 'merged'

    pull_request = models.ForeignKey('gh_pull_requests.GhPullRequest', models.DO_NOTHING,
        related_name='history'
    )
    created_at = models.DateTimeField()
    ext_ref_id = models.CharField(max_length=24)
    action = models.CharField(max_length=255)
    actor = models.ForeignKey('gh_users.GhUser', models.DO_NOTHING, blank=True, null=True)

    def __str__(self):
        return 'history for PR: %s' %self.pull_request.base_repo.name

    class Meta:
        db_table = 'pull_request_history'
        verbose_name = 'GitHub Pull Request History'
