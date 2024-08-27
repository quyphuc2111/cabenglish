import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import StudyReport from '@/components/learning-report/study-report'
import ListGroup from '@/components/learning-report/list-group'

function LearningReport() {
  return (
    <ContentLayout title="GiftShop">
        <StudyReport />
        <ListGroup />
    </ContentLayout>
  )
}

export default LearningReport