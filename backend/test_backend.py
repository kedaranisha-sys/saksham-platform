import unittest
from app import create_app
import json

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_health(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)

    def test_jobs(self):
        response = self.client.get('/api/jobs')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('jobs', data)
        self.assertGreater(len(data['jobs']), 0)

    def test_schemes(self):
        response = self.client.get('/api/schemes')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('schemes', data)
        self.assertGreater(len(data['schemes']), 0)

    def test_legal(self):
        response = self.client.get('/api/legal')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('legal_resources', data)

    def test_locations(self):
        response = self.client.get('/api/locations')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('locations', data)

    def test_ai_chat(self):
        response = self.client.post('/api/ai/chat', json={'message': 'I know tailoring. How can I earn money?'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('reply', data)
        self.assertIn('suggested_actions', data)

    def test_ai_business_plan(self):
        response = self.client.post('/api/ai/business-plan', json={'skill_or_idea': 'Tailoring and embroidery'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('business_plan', data)
        self.assertIn('title', data['business_plan'])

if __name__ == '__main__':
    unittest.main()
